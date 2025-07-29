const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 45678;

// Middleware
app.use(bodyParser.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - User-Agent: ${req.get('User-Agent')}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
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
  console.log('Root endpoint requested');
  res.json({ 
    message: 'Supabase MCP HTTP Server is running!',
    endpoints: {
      health: '/health',
      mcp: '/mcp (POST)',
      status: '/status',
      test: '/test'
    },
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for agent testing
app.get('/test', (req, res) => {
  console.log('Test endpoint requested');
  res.json({
    message: 'Test endpoint working!',
    method: req.method,
    path: req.path,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint that accepts POST
app.post('/test', (req, res) => {
  console.log('Test POST endpoint requested');
  res.json({
    message: 'Test POST endpoint working!',
    method: req.method,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Status endpoint for debugging
app.get('/status', (req, res) => {
  console.log('Status endpoint requested');
  res.json({
    server: 'running',
    port: PORT,
    environment: {
      SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN ? '***SET***' : 'NOT SET',
      PROJECT_REF: process.env.PROJECT_REF || 'NOT SET',
      FEATURES: process.env.FEATURES || 'NOT SET'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  console.log('MCP endpoint requested');
  try {
    const mcpData = req.body;
    
    // Validate required environment variables
    if (!process.env.SUPABASE_ACCESS_TOKEN) {
      console.log('Error: SUPABASE_ACCESS_TOKEN not set');
      return res.status(500).json({ error: 'SUPABASE_ACCESS_TOKEN not set' });
    }
    
    if (!process.env.PROJECT_REF) {
      console.log('Error: PROJECT_REF not set');
      return res.status(500).json({ error: 'PROJECT_REF not set' });
    }
    
    console.log('Spawning MCP server process...');
    
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
      console.log(`MCP process closed with code: ${code}`);
      if (code === 0) {
        try {
          const parsedResponse = JSON.parse(response);
          res.json(parsedResponse);
        } catch (e) {
          console.log('Error parsing JSON response:', e);
          res.status(500).json({ error: 'Invalid JSON response', response });
        }
      } else {
        console.log('MCP process failed:', error);
        res.status(500).json({ error: 'MCP process failed', stderr: error, code });
      }
    });

    // Send data to MCP process
    mcpProcess.stdin.write(JSON.stringify(mcpData) + '\n');
    mcpProcess.stdin.end();

  } catch (err) {
    console.log('Error in MCP endpoint:', err);
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
  console.log(`404 - Endpoint not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint not found', 
    method: req.method,
    path: req.path,
    available: ['/', '/health', '/status', '/test', '/mcp (POST)'] 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP HTTP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Status: http://localhost:${PORT}/status`);
  console.log(`Test: http://localhost:${PORT}/test`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Root: http://localhost:${PORT}/`);
}); 