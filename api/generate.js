export default async function handler(req, res) {
  try {
    const { action, headline, supportingText, cta } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OpenAI API key." });
    }

    const systemPrompt =
      "You are an expert Facebook ad copywriter for landscaping businesses.";

    let userPrompt = "";

    if (action === "generate") {
      userPrompt = `Create a high-converting Facebook ad for a landscaping business.

Headline: ${headline}
Supporting text: ${supportingText}
CTA: ${cta}

Return JSON with:
headline
supportingText
cta`;
    }

    if (action === "variations") {
      userPrompt = `Create 5 variations of this landscaping ad.

Headline: ${headline}
Supporting text: ${supportingText}
CTA: ${cta}

Return JSON array with headline, supportingText, cta.`;
    }

    if (action === "caption") {
      userPrompt = `Write a social media caption for this landscaping ad.

Headline: ${headline}
Supporting text: ${supportingText}`;
    }

    if (action === "content30") {
      userPrompt = `Create a simple 30-day content plan for a landscaping business social media page.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content || "";

    res.status(200).json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
}
