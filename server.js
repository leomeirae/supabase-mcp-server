const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 45678;

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: {
      hasToken: !!process.env.SUPABASE_ACCESS_TOKEN,
      hasProjectRef: !!process.env.PROJECT_REF,
      features: process.env.FEATURES
    }
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Supabase MCP HTTP Server is running!',
    endpoints: {
      health: '/health',
      mcp: '/mcp (POST)',
      status: '/status'
    },
    timestamp: new Date().toISOString()
  });
});

// Status endpoint for debugging
app.get('/status', (req, res) => {
  res.json({
    server: 'running',
    port: PORT,
    environment: {
      SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN ? '***SET***' : 'NOT SET',
      PROJECT_REF: process.env.PROJECT_REF || 'NOT SET',
      FEATURES: process.env.FEATURES || 'NOT SET'
    },
    uptime: process.uptime()
  });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const mcpData = req.body;
    
    // Validate required environment variables
    if (!process.env.SUPABASE_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'SUPABASE_ACCESS_TOKEN not set' });
    }
    
    if (!process.env.PROJECT_REF) {
      return res.status(500).json({ error: 'PROJECT_REF not set' });
    }
    
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', available: ['/', '/health', '/status', '/mcp'] });
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP HTTP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Status: http://localhost:${PORT}/status`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Root: http://localhost:${PORT}/`);
}); 