const serverless = require("serverless-http");
const express = require("express");
const stripeFullstackAPIs = require("../src/app.js");
const app = express();

app.use("/.netlify/functions/api", stripeFullstackAPIs);
// module.exports.handler = async serverless(app);
module.exports.handler = async (event, context) => {
  // Set context callbackWaitsForEmptyEventLoop to false
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const handler = serverless(app, {
      // Configure serverless-http options
      binary: ["image/png", "image/jpeg"],
      request: {
        // Set API Gateway timeout
        timeout: 29000, // 29 seconds (just under the 30s limit)
      },
    });

    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error("Serverless handler error:", error);
    return {
      statusCode: 504,
      body: JSON.stringify({ error: "Gateway Timeout" }),
    };
  }
};
