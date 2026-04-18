// ============================================================
//  Shannon Iris Pub — API Proxy Server
//  Node.js + Express · Puerto 3000
// ============================================================
//  Instalar dependencias:  npm install
//  Arrancar:               npm start
//  Producción:             npm install -g pm2 && pm2 start server.js
// ============================================================

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(cors());                          // ajusta el origen en producción
app.use(express.static(path.join(__dirname, 'public')));

// ── Ruta principal: proxy hacia Anthropic ───────────────────
app.post('/api/cocktail', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-5',
        max_tokens: 1024,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    res.json({ text });

  } catch (err) {
    console.error('Anthropic fetch error:', err);
    res.status(502).json({ error: 'Failed to reach Anthropic API' });
  }
});

// ── Catch-all → sirve index.html (SPA) ─────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🍀 Shannon Iris Pub server running → http://localhost:${PORT}`);
});
