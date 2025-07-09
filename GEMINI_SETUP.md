# Gemini API Setup Guide

## Problem
The queries are not working because the Gemini API key is not properly configured. The application needs a valid Google Gemini API key to process natural language queries and generate SQL.

## Solution

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Set the Environment Variable

#### Windows (PowerShell):
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
```

#### Windows (Command Prompt):
```cmd
set GEMINI_API_KEY=your-api-key-here
```

#### Linux/Mac:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

### Step 3: Restart the Backend

After setting the environment variable, restart the backend application:

```bash
cd Asklytics/backend
mvn spring-boot:run
```

### Step 4: Test the Configuration

Once the backend is running, you can test if the Gemini API is working:

1. Open your browser and go to: `http://localhost:8080/api/analytics/test-gemini`
2. You should see a JSON response indicating if the API is working

### Step 5: Test Queries

Now you can test queries in the frontend:
1. Start the frontend: `cd Asklytics/frontend && npm start`
2. Go to the Analytics page
3. Try a sample query like "Show me employees with salary above 50000"

## Troubleshooting

### If you get "API key not configured" error:
- Make sure you've set the `GEMINI_API_KEY` environment variable
- Restart the backend after setting the variable
- Check that the variable is set correctly: `echo $env:GEMINI_API_KEY` (PowerShell)

### If you get "Invalid API key" error:
- Verify your API key is correct
- Make sure you copied the entire key without extra spaces
- Check that your Google AI Studio account has access to Gemini

### If queries still don't work:
- Check the backend logs for detailed error messages
- Test the API endpoint directly: `http://localhost:8080/api/analytics/test-gemini`
- Make sure both frontend and backend are running

## Alternative: Temporary API Key for Testing

If you want to test quickly, you can temporarily add a valid API key to the `application.yml` file:

```yaml
gemini:
  api-key: ${GEMINI_API_KEY:your-actual-api-key-here}
  model: gemini-pro
  max-tokens: 1000
```

**Note:** This is not recommended for production use. Always use environment variables for API keys. 