import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Secure backend handler for Gemini API requests.
 * API key is stored in Vercel environment variables (never exposed to frontend).
 * 
 * Usage:
 * POST /api/gemini
 * Body: {
 *   "contents": [...],
 *   "systemInstruction": "...",
 *   "responseMimeType": "application/json",
 *   "responseSchema": {...}
 * }
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contents, systemInstruction, responseMimeType, responseSchema, model } = req.body;

    // Validate required fields
    if (!contents) {
      return res.status(400).json({ error: 'Missing required field: contents' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const modelName = model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

    // Build request payload
    const payload: any = {
      contents: Array.isArray(contents) ? contents : [{ parts: [{ text: contents }] }],
    };

    if (systemInstruction) {
      payload.systemInstruction = systemInstruction;
    }

    if (responseMimeType) {
      payload.generationConfig = {
        responseMimeType,
        ...(responseSchema && { responseSchema }),
      };
    }

    // Make request to Google Generative AI API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: 'Failed to process Gemini request',
      message: error?.message || 'Unknown error',
    });
  }
}
