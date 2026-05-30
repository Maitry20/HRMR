const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists (zero-dependency)
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        // Remove surrounding quotes if any
        if (val.length > 0 && val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') {
          val = val.substring(1, val.length - 1);
        }
        if (val.length > 0 && val.charAt(0) === "'" && val.charAt(val.length - 1) === "'") {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  console.warn("Failed to load .env.local file:", e.message);
}

const lambda = require('./lambda/index.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS so the React frontend on port 5173 can query this server
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token']
}));

// Parse large JSON payloads (since base64 PDFs can be 1MB-5MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Print startup check
console.log('\x1b[36m%s\x1b[0m', '===================================================');
console.log('\x1b[36m%s\x1b[0m', '   HIRE ME OR ROAST ME 🔥 - LOCAL BACKEND SERVER   ');
console.log('\x1b[36m%s\x1b[0m', '===================================================');

const hasOpenAi = process.env.OPENAI_API_KEY;
const openAiModel = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
const hasAwsEnv = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
const hasAwsProfile = process.env.AWS_PROFILE;

if (hasOpenAi) {
  console.log('\x1b[32m%s\x1b[0m', `🟢 LIVE COGNITIVE ENGINE: OpenAI ${openAiModel} Active!`);
  console.log('\x1b[36m%s\x1b[0m', '===================================================');
} else if (hasAwsEnv || hasAwsProfile) {
  console.log('\x1b[34m%s\x1b[0m', '🔵 LIVE COGNITIVE ENGINE: AWS Bedrock Claude 3.5 Active!');
  console.log('\x1b[36m%s\x1b[0m', '===================================================');
} else {
  console.log('\x1b[33m%s\x1b[0m', '⚠️  No LLM API keys explicitly set in process.env.');
  console.log('\x1b[32m%s\x1b[0m', `👉 Note: You can configure OPENAI_API_KEY to run live OpenAI ${openAiModel} roasts.`);
  console.log('\x1b[32m%s\x1b[0m', '👉 Alternatively, configure AWS CLI or credentials to use Bedrock Claude.');
  console.log('\x1b[32m%s\x1b[0m', '👉 The local proxy will fall back to the Offline Mock Engine if APIs fail.');
  console.log('\x1b[36m%s\x1b[0m', '===================================================');
}

// POST endpoint to handle the profile roasting
app.post('/roast', async (req, res) => {
  console.log(`\n\x1b[35m[POST /roast]\x1b[0m Received audit request...`);
  const { type, fileName } = req.body;
  
  if (type === 'file') {
    console.log(`📂 Processing PDF file upload: ${fileName || 'Unnamed document'}`);
  } else if (type === 'text') {
    console.log(`📝 Processing direct profile text copy-paste...`);
  } else if (type === 'url') {
    console.log(`🔗 Processing LinkedIn profile URL: ${req.body.data}`);
  }

  // Construct standard AWS Lambda Proxy event structure
  const lambdaEvent = {
    httpMethod: 'POST',
    body: JSON.stringify(req.body),
    headers: req.headers
  };

  try {
    console.log(`⚡ Invoking local Lambda function handler...`);
    const lambdaResponse = await lambda.handler(lambdaEvent);

    console.log(`✅ Lambda response: status ${lambdaResponse.statusCode}`);
    
    // Set custom headers returned by the Lambda handler
    if (lambdaResponse.headers) {
      Object.entries(lambdaResponse.headers).forEach(([key, val]) => {
        res.setHeader(key, val);
      });
    }

    res.status(lambdaResponse.statusCode).send(lambdaResponse.body);
  } catch (error) {
    console.error(`❌ Local Lambda Handler threw an exception:`, error);
    res.status(500).json({
      message: "Local server proxy error running Lambda handler",
      error: error.message
    });
  }
});

// A quick health-check endpoint
app.get('/health', (req, res) => {
  res.json({ status: "alive", environment: process.env.NODE_ENV || "development" });
});

app.listen(PORT, () => {
  console.log(`\n\x1b[32m🚀 Server listening at http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[35m👉 Frontend will communicate on this endpoint when VITE_API_URL is configured.\x1b[0m\n`);
});
