export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
  }

  const { contents, systemInstruction, tools } = req.body || {};

  if (!contents) {
    return res.status(400).json({ error: 'Missing required "contents" payload.' });
  }

  const basePayload = { contents };
  if (systemInstruction) {
    basePayload.systemInstruction = systemInstruction;
  }
  if (tools) {
    basePayload.tools = tools;
  }

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = 'Upstream API error';

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basePayload),
      });

      if ((response.status === 400 || response.status === 404) && basePayload.tools) {
        const fallbackPayload = { ...basePayload };
        delete fallbackPayload.tools;
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallbackPayload),
        });
      }

      if (!response.ok) {
        lastError = await response.text();
        continue;
      }

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (replyText) {
        return res.status(200).json({ text: replyText, model: modelName });
      }
    } catch (error) {
      lastError = error.message || 'Internal server error';
    }
  }

  return res.status(502).json({ error: `Upstream API error: ${lastError}` });
}