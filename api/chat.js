let cachedDynamicModels = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;

async function getOrderedModelsToTry(apiKey) {
  const now = Date.now();
  if (cachedDynamicModels && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedDynamicModels;
  }

  const fallbackOrder = [
    'gemini-flash-latest',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (res.ok) {
      const data = await res.json();
      const models = Array.isArray(data?.models) ? data.models : [];

      const flashCandidates = models
        .filter((m) => {
          const name = (m?.name || '').replace(/^models\//, '');
          const methods = m?.supportedGenerationMethods || [];
          return (
            methods.includes('generateContent') &&
            /^gemini-[0-9.]+-flash$/.test(name)
          );
        })
        .map((m) => m.name.replace(/^models\//, ''))
        .sort((a, b) => {
          const verA = parseFloat(a.replace('gemini-', '').replace('-flash', '')) || 0;
          const verB = parseFloat(b.replace('gemini-', '').replace('-flash', '')) || 0;
          return verB - verA;
        });

      const combined = Array.from(
        new Set([...flashCandidates, ...fallbackOrder])
      );
      cachedDynamicModels = combined;
      cacheTimestamp = now;
      return combined;
    }
  } catch {
    // Fall back to static + rolling alias list if model listing fails
  }

  return fallbackOrder;
}

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

  const preferredEnvModel = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL;
  const discoveredModels = await getOrderedModelsToTry(apiKey);
  const modelsToTry = preferredEnvModel
    ? Array.from(new Set([preferredEnvModel, ...discoveredModels]))
    : discoveredModels;

  let lastError = 'Upstream API error';

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basePayload),
      });

      if (!response.ok && basePayload.tools) {
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
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const replyText = parts
        .map((p) => p?.text || '')
        .filter(Boolean)
        .join('\n')
        .trim();

      if (replyText) {
        return res.status(200).json({ text: replyText, model: modelName });
      }
    } catch (error) {
      lastError = error.message || 'Internal server error';
    }
  }

  return res.status(502).json({ error: `Upstream API error: ${lastError}` });
}