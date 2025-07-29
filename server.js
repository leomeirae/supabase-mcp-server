const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const mcpData = req.body;
    
    // Spawn the MCP server process
    const mcpProcess = spawn('npx', [
      '-y',
      '@supabase/mcp-server-supabase@latest',
      '--access-token', process.env.SUPABASE_ACCESS_TOKEN,
      '--project-ref', process.env.PROJECT_REF,
      '--features', process.env.FEATURES || 'database,docs,functions,storage,debug,development'
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let response = '';
    let error = '';

    // Handle stdout
    mcpProcess.stdout.on('data', (data) => {
      response += data.toString();
    });

    // Handle stderr
    mcpProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    mcpProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const parsedResponse = JSON.parse(response);
          res.json(parsedResponse);
        } catch (e) {
          res.status(500).json({ error: 'Invalid JSON response', response });
        }
      } else {
        res.status(500).json({ error: 'MCP process failed', stderr: error, code });
      }
    });

    // Send data to MCP process
    mcpProcess.stdin.write(JSON.stringify(mcpData) + '\n');
    mcpProcess.stdin.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP HTTP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
}); 