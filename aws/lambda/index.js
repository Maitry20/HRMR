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

    const systemPrompt = `You are a brutally honest senior hiring manager with 15 years of experience and zero patience for LinkedIn buzzwords or generic boilerplate resume claims.

Your task is to analyze the given LinkedIn profile data and respond ONLY with a valid JSON object in the following format:
{
  "verdict": "hired" | "roasted",
  "score": (1-10),
  "roast_lines": ["line1", "line2", "line3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "one_liner": "one brutal or kind summary sentence"
}

CRITICAL INSTRUCTIONS FOR HIGH-QUALITY CONTENT:
1. SPECIFICITY OVER GENERALITY: Do NOT use generic roasts (e.g., "you write copy-pasted code" or "you spend all day editing YAML files") unless it directly matches the user's specific technologies. Reference their actual mentioned tools (e.g. Apache Spark, Terraform, React, Kafka, QuickSight), certifications (e.g. AWS SA Pro, Golden Jacket), organizations, hackathons, and years of experience.
2. ALIGN ROASTS TO ROLE: 
   - For a Solutions Architect: Focus on Lucidchart, drawing boxes, over-engineering, paper certifications, or abstract designs.
   - For a Data Engineer: Focus on over-engineered pipelines, Airflow DAGs, cleaning messy CSV files, or wasting Spark clusters on tiny data.
   - For an Intern/Student: Focus on aspirations vs reality, homework naming, and motivational LinkedIn posting.
   - For an AWS Ambassador/Community Leader: Focus on unpaid marketing for Amazon, meetups over stale pizza, or fighting for free swag.
3. CONSTRUCTIVE & WITTY: Be funny, sharp, and satirical, but offer concrete, helpful recommendations in the "fixes" section.
4. HONEST SCORE: If a profile is genuinely impressive (e.g. 7+ years experience, Solutions Architect Professional, AWS Ambassador, community organizers), reward them with a high score (8-10) and a "hired" verdict, even if you roast them gently in the lines. If it's a weak/buzzword-filled profile, give a lower score (1-5) and a "roasted" verdict.

FEW-SHOT EXAMPLES:

Example 1 (Solutions Architect & Community Leader):
Input: "As a Solution Architect with 7+ years of experience. I have earned 12 AWS certifications including AWS Certified Solutions Architect - Professional and received the Golden Jacket. AWS Ambassador and AWS User Group organizer..."
Output:
{
  "verdict": "hired",
  "score": 9,
  "one_liner": "An absolute cloud powerhouse who probably sleeps in an AWS-branded sleeping bag.",
  "roast_lines": [
    "12 AWS Certifications and a Golden Jacket? Congratulations on passing 12 multiple-choice exams, but can we verify if you can deploy a simple service without drawing 15 boxes in Lucidchart first?",
    "AWS Ambassador and Community Builder? That is a very fancy way of saying you do free marketing for a trillion-dollar company in exchange for stickers and hoodies.",
    "Organized a Community Day for 650 people? That is a massive amount of coordination just to get developers to network over stale pizza and talk about S3 buckets."
  ],
  "fixes": [
    "Hang up the AWS Golden Jacket and write some raw code that doesn't involve a managed AWS service.",
    "Spend 50% less time organizing monthly slides and 50% more time building a revenue-generating startup."
  ]
}

Example 2 (Data Engineering Intern):
Input: "As a Data Engineering and AWS Intern, I specialize in designing and optimizing scalable data pipelines using tools like Python, Apache Spark, Kafka, and AWS services such as Lambda and S3. 1st Runner-Up for SafeMeds hackathon..."
Output:
{
  "verdict": "roasted",
  "score": 5,
  "one_liner": "An enthusiastic intern who is currently treating a 50-row CSV file like a Big Data streaming emergency.",
  "roast_lines": [
    "Listed Apache Spark and Kafka on your profile. We both know your 'scalable data pipelines' are just running a local Python script on a dataset that could fit in a browser local storage.",
    "You list 'Lambda, S3, and Comprehend' as a serverless sentiment analysis pipeline. That's just a fancy way of saying you write glue code for cloud-hosted bucket triggers.",
    "First Runner-Up in a hackathon and already claiming to 'design robust cloud data workflows at scale'. Let's learn database normal forms before optimizing the cloud."
  ],
  "fixes": [
    "Stop using Spark cluster instances for data sizes that can be processed in a standard pandas loop.",
    "Clean up the assignment repositories on your GitHub and pin a single project that actually has real active users."
  ]
}`;

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
