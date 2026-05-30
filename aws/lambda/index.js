const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { TextractClient, DetectDocumentTextCommand } = require("@aws-sdk/client-textract");

// Initialize AWS Clients (will pick up credentials from execution role automatically)
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "eu-west-2" });

if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
  console.log("🔑 Configuring Bedrock client with Bearer Token middleware...");
  try {
    bedrockClient.middlewareStack.remove("awsAuthMiddleware");
  } catch (err) {
    console.warn("Failed to remove awsAuthMiddleware:", err.message);
  }
  bedrockClient.middlewareStack.add(
    (next, context) => async (args) => {
      args.request.headers["Authorization"] = `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`;
      return next(args);
    },
    {
      step: "build",
      name: "addBearerTokenMiddleware",
    }
  );
}

const textractClient = new TextractClient({ region: process.env.AWS_REGION || "eu-west-2" });

exports.handler = async (event) => {
  // Setup CORS Headers for API Gateway
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };

  // Handle API Gateway preflight OPTIONS check
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Request body is empty" })
      };
    }

    const requestBody = JSON.parse(event.body);
    const { type, data, fileName } = requestBody;

    if (!type || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid request. Missing 'type' or 'data'." })
      };
    }

    let profileText = "";

    if (type === "file") {
      // PDF File Upload flow: Expects data to be base64-encoded PDF string
      console.log(`Processing file: ${fileName || "LinkedIn Resume Export"}`);
      const pdfBytes = Buffer.from(data, "base64");

      // Invoke AWS Textract to parse the PDF document's text content
      const textractCommand = new DetectDocumentTextCommand({
        Document: {
          Bytes: pdfBytes
        }
      });
      
      const textractResponse = await textractClient.send(textractCommand);
      
      // Stitch detected lines of text together
      const detectedLines = textractResponse.Blocks
        ? textractResponse.Blocks.filter(block => block.BlockType === "LINE").map(block => block.Text)
        : [];
      
      profileText = detectedLines.join("\n");

      if (!profileText.trim()) {
        throw new Error("Could not extract any legible text from the uploaded LinkedIn PDF export.");
      }
    } else if (type === "text") {
      // Direct LinkedIn About section text submission
      console.log(`Processing direct profile text: ${fileName || "About Section"}`);
      profileText = data;
    } else if (type === "url") {
      // URL submission flow:
      // Note: Scraping LinkedIn directly from a Lambda requires auth sessions.
      // We pass the URL context and username to Bedrock to roast their public presence/branding.
      console.log(`Processing LinkedIn URL: ${data}`);
      profileText = `LinkedIn Profile URL: ${data}\nUser Profile Name/Handle: ${data.split('/in/')[1] || data}`;
    }

    // Designate Bedrock Claude model
    // Bedrock model ID: anthropic.claude-3-7-sonnet-20250219-v1:0 by default
    const modelId = process.env.BEDROCK_MODEL || "anthropic.claude-3-7-sonnet-20250219-v1:0";

    const systemPrompt = `You are a brutally honest senior hiring manager with 15 years of experience and zero patience for LinkedIn buzzwords. 

Analyze the given LinkedIn profile and respond ONLY in valid JSON:
{
  "verdict": "hired" or "roasted",
  "score": (1-10),
  "roast_lines": ["line1", "line2", "line3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "one_liner": "one brutal or kind summary sentence"
}

Be funny, sharp, and specific. Reference actual content from their profile. If the profile is genuinely good, be generous. If it's bad, be savage but constructive.`;

    const userMessage = `Here is the LinkedIn profile data to review:
===================
${profileText}
===================`;

    let cleanJsonResult;

    if (process.env.OPENAI_API_KEY) {
      const selectedModel = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
      console.log(`⚡ Utilizing live OpenAI API (model: ${selectedModel})...`);
      try {
        const openAiBaseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
        const response = await fetch(`${openAiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI API HTTP ${response.status}: ${errText}`);
        }

        const openAiResult = await response.json();
        const assistantContent = openAiResult.choices[0].message.content;
        cleanJsonResult = JSON.parse(assistantContent);
      } catch (openAiError) {
        console.error("OpenAI Execution Error:", openAiError);
        throw openAiError;
      }
    } else {
      console.log("⚡ Utilizing live AWS Bedrock API (model: Claude 3.5 Sonnet)...");
      const bedrockPayload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userMessage
              }
            ]
          }
        ],
        temperature: 0.8
      };

      const bedrockCommand = new InvokeModelCommand({
        modelId: modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(bedrockPayload)
      });

      const bedrockResponse = await bedrockClient.send(bedrockCommand);
      const responseBodyString = new TextDecoder().decode(bedrockResponse.body);
      const responseJson = JSON.parse(responseBodyString);

      // Extract the assistant's text block containing the JSON response
      const assistantContent = responseJson.content[0].text;
      
      try {
        cleanJsonResult = JSON.parse(assistantContent);
      } catch (parseError) {
        // Handle potential ```json wrapper
        const jsonRegex = /({[\s\S]*})/;
        const match = assistantContent.match(jsonRegex);
        if (match) {
          cleanJsonResult = JSON.parse(match[1]);
        } else {
          throw new Error("AWS Bedrock failed to respond with a clean parsed JSON object.");
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cleanJsonResult)
    };

  } catch (error) {
    console.error("Handler Error: ", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Failed to audit profile",
        error: error.message
      })
    };
  }
};
