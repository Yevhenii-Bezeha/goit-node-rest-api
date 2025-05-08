const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>My AWS Project</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #0066cc; }
          .container { max-width: 800px; margin: 0 auto; }
          .info { background-color: #f5f5f5; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>My Custom Node.js Application</h1>
          <div class="info">
            <p>This is a custom application deployed on AWS Elastic Beanstalk.</p>
            <p>Current server time: ${new Date().toLocaleString()}</p>
            <p>Server: Node.js on AWS Elastic Beanstalk</p>
          </div>
          <h2>Features of My Project:</h2>
          <ul>
            <li>Custom Node.js application</li>
            <li>Deployed to Elastic Beanstalk</li>
            <li>Auto-scaling configuration</li>
            <li>Load balancing</li>
            <li>CloudWatch monitoring</li>
          </ul>
          <p>View <a href="/health">Health Check</a> | <a href="/cpustress">CPU Stress Test</a></p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK - Health check passed");
});

// CPU stress test endpoint for testing auto-scaling
app.get("/cpustress", (req, res) => {
  console.log("Starting CPU stress test");
  const start = Date.now();

  // Heavy computation to generate CPU load
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i);
  }

  const duration = Date.now() - start;
  res.send(`CPU stress test completed in ${duration}ms. Result: ${result}`);
});

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
