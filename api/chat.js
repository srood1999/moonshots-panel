export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
  }

  const { contents, systemInstruction } = req.body;

  if (!contents) {
    return res.status(400).json({ error: 'Missing required "contents" payload.' });
  }

  const payload = { contents };
  if (systemInstruction) {
    payload.systemInstruction = systemInstruction;
  }

  try {

	const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: `Upstream API error: ${errorData}` });
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ text: replyText });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}