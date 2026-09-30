export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || '';
  const host = req.headers.host || '';
  if (!origin.endsWith('://' + host)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }
  const text = typeof body.text === 'string' ? body.text.trim() : '';

  if (!text) return res.status(400).json({ error: 'No text provided' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is missing. Add it in the hosting environment.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text.slice(0, 500),
        voice: 'nova',
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err || 'OpenAI TTS failed' });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(buffer);
  } catch (e) {
    console.error('OpenAI TTS API error:', e);
    return res.status(500).json({ error: e.message || 'Unexpected OpenAI TTS error' });
  }
}
