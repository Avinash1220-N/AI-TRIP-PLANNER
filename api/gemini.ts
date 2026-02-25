// /api/gemini.ts

export default async function handler(req: any, res: any) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      contents,
      systemInstruction,
      responseMimeType,
      responseSchema,
      model,
    } = req.body || {};

    // Basic validation
    if (!contents) {
      return res.status(400).json({ error: "Missing contents" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    // Build Gemini payload
    const payload: any = {
      contents: Array.isArray(contents)
        ? contents
        : [{ parts: [{ text: contents }] }],
    };

    // Correct Gemini format
    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    // Optional generation config
    if (responseMimeType) {
      payload.generationConfig = {
        responseMimeType,
        ...(responseSchema ? { responseSchema } : {}),
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${
        model || "gemini-2.5-flash"
      }:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Gemini backend failed",
      message: error?.message || "Unknown error",
    });
  }
}