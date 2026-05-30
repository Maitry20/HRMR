#!/bin/bash
set -e

# ====================================================================
#   HIRE ME OR ROAST ME 🔥 - AWS SINGLE-CLICK CLOUD PROVISIONING
#   Target Region: eu-west-2 (London, UK)
# ====================================================================

REGION="eu-west-2"
ROLE_NAME="HMRM-Lambda-Execution-Role"
FUNCTION_NAME="HireMeOrRoastMe-Auditor"
API_NAME="HMRM-API"

echo -e "\n\x1b[36m[1/5] Checking AWS Credentials and CLI...\x1b[0m"
# Confirm caller identity
CALLER_ARN=$(aws sts get-caller-identity --query "Arn" --output text)
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
echo -e "✅ Authenticated as: \x1b[32m$CALLER_ARN\x1b[0m (Account: $ACCOUNT_ID)"

echo -e "\n\x1b[36m[2/5] Provisioning IAM Role and Permissions...\x1b[0m"
# Check if execution role exists
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text 2>/dev/null || true)

if [ -z "$ROLE_ARN" ]; then
  echo "Role $ROLE_NAME does not exist. Creating..."
  
  # Create a trust relationship policy file
  cat <<EOF > trust-relationship.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  ROLE_ARN=$(aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document file://trust-relationship.json --query "Role.Arn" --output text)
  rm trust-relationship.json
  echo -e "✅ Created IAM Role: \x1b[32m$ROLE_ARN\x1b[0m"
  
  # Give IAM role creation a few seconds to propagate
  echo "Sleeping 8 seconds for role propagation..."
  sleep 8
else
  echo -e "✅ Found existing IAM Role: \x1b[32m$ROLE_ARN\x1b[0m"
fi

# Attach standard AWSLambdaBasicExecutionRole policy
echo "Attaching Basic Lambda Execution permissions..."
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create/Attach custom inline policy for Bedrock & Textract
echo "Applying custom Bedrock and Textract permissions..."
cat <<EOF > inline-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TextractPermission",
      "Effect": "Allow",
      "Action": [
        "textract:DetectDocumentText"
      ],
      "Resource": "*"
    },
    {
      "Sid": "BedrockPermission",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
    }
  ]
}
EOF

aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name HMRM-Backend-Permissions --policy-document file://inline-policy.json
rm inline-policy.json
echo "✅ Attached Bedrock and Textract policy successfully."

echo -e "\n\x1b[36m[3/5] Packaging and Deploying AWS Lambda to $REGION...\x1b[0m"
# Package Lambda Function
echo "Zipping Lambda code..."
if [ -f "aws/lambda.zip" ]; then
  rm aws/lambda.zip
fi
cd aws/lambda
zip -q ../lambda.zip index.js
cd ../..
echo "✅ Packaged index.js into aws/lambda.zip"

# Check if Lambda function exists
LAMBDA_EXISTS=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" 2>/dev/null || true)

if [ -z "$LAMBDA_EXISTS" ]; then
  echo "Lambda function $FUNCTION_NAME does not exist in $REGION. Creating..."
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime nodejs20.x \
    --role "$ROLE_ARN" \
    --handler index.handler \
    --zip-file fileb://aws/lambda.zip \
    --timeout 30 \
    --region "$REGION"
  echo -e "✅ Successfully created Lambda function in \x1b[32m$REGION\x1b[0m!"
else
  echo "Lambda function $FUNCTION_NAME already exists. Updating code..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb://aws/lambda.zip \
    --region "$REGION"
  echo -e "✅ Successfully updated Lambda function code in \x1b[32m$REGION\x1b[0m!"
fi

echo -e "\n\x1b[36m[4/5] Provisioning AWS API Gateway (HTTP API) in $REGION...\x1b[0m"
# Check if API Gateway exists
API_ID=$(aws apigatewayv2 get-apis --region "$REGION" --query "Items[?Name=='$API_NAME'].ApiId" --output text 2>/dev/null || true)

if [ -z "$API_ID" ] || [ "$API_ID" = "None" ]; then
  echo "API Gateway $API_NAME does not exist. Creating..."
  API_ID=$(aws apigatewayv2 create-api \
    --name "$API_NAME" \
    --protocol-type HTTP \
    --query "ApiId" \
    --output text \
    --region "$REGION")
  echo -e "✅ Created HTTP API Gateway: \x1b[32m$API_ID\x1b[0m"
else
  echo -e "✅ Found existing HTTP API Gateway: \x1b[32m$API_ID\x1b[0m"
fi

# Configure CORS for the API Gateway
echo "Applying CORS rules (* origins, POST/OPTIONS methods)..."
aws apigatewayv2 update-api \
  --api-id "$API_ID" \
  --cors-configuration '{"AllowOrigins": ["*"], "AllowMethods": ["POST", "OPTIONS"], "AllowHeaders": ["content-type", "authorization"]}' \
  --region "$REGION"

# Get Lambda ARN
LAMBDA_ARN=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --query "Configuration.FunctionArn" --output text)

# Set up integration between API Gateway and Lambda
INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id "$API_ID" --region "$REGION" --query "Items[?contains(IntegrationUri, '$FUNCTION_NAME')].IntegrationId" --output text 2>/dev/null || true)

if [ -z "$INTEGRATION_ID" ] || [ "$INTEGRATION_ID" = "None" ]; then
  echo "Creating integration between API Gateway and Lambda..."
  INTEGRATION_ID=$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --integration-type AWS_PROXY \
    --integration-uri "$LAMBDA_ARN" \
    --payload-format-version "2.0" \
    --query "IntegrationId" \
    --output text \
    --region "$REGION")
  echo -e "✅ Created Integration: \x1b[32m$INTEGRATION_ID\x1b[0m"
else
  echo -e "✅ Found existing Integration: \x1b[32m$INTEGRATION_ID\x1b[0m"
fi

# Set up the POST /roast route
ROUTE_ID=$(aws apigatewayv2 get-routes --api-id "$API_ID" --region "$REGION" --query "Items[?RouteKey=='POST /roast'].RouteId" --output text 2>/dev/null || true)

if [ -z "$ROUTE_ID" ] || [ "$ROUTE_ID" = "None" ]; then
  echo "Creating route 'POST /roast'..."
  ROUTE_ID=$(aws apigatewayv2 create-route \
    --api-id "$API_ID" \
    --route-key "POST /roast" \
    --target "integrations/$INTEGRATION_ID" \
    --query "RouteId" \
    --output text \
    --region "$REGION")
  echo -e "✅ Created Route: \x1b[32m$ROUTE_ID\x1b[0m"
else
  echo -e "✅ Found existing Route: \x1b[32m$ROUTE_ID\x1b[0m"
fi

# Grant API Gateway permission to invoke Lambda
echo "Configuring Lambda Invoke permissions for API Gateway..."
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*" \
  --region "$REGION" 2>/dev/null || true
echo "✅ Configured Invoke permissions."

# Fetch API Gateway Endpoint
API_ENDPOINT=$(aws apigatewayv2 get-api --api-id "$API_ID" --region "$REGION" --query "ApiEndpoint" --output text)

echo -e "\n\x1b[36m[5/5] Hooking up Local Frontend Environment...\x1b[0m"
# Overwrite local environment file
echo "# Production AWS API gateway pointing to our live Claude 3.5 Sonnet stack in London" > .env.local
echo "VITE_API_URL=$API_ENDPOINT" >> .env.local
echo -e "✅ Updated \x1b[32m.env.local\x1b[0m with live Endpoint: \x1b[32m$API_ENDPOINT\x1b[0m"

echo -e "\n\x1b[32m🎉 DEPLOYMENT TO $REGION COMPLETED SUCCESSFULLY!\x1b[0m"
echo -e "👉 Restart your Vite dev server to communicate directly with your live London AWS Lambda! (URL: $API_ENDPOINT/roast)\n"
