export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured. Add OPENAI_API_KEY in Vercel Environment Variables.' });
  }

  const {
    type, biz, city, service, offer, target, tone, platforms,
    platform, messages, ideaTitle, ideaCat, ideaDesc,
    phone, template
  } = req.body;

  let userPrompt = '';
  let systemPrompt = '';
  let maxTokens = 1200;
  let returnJSON = false;

  if (type === 'visual') {
    // Returns structured JSON for the canvas renderer
    returnJSON = true;
    maxTokens = 400;

    const templateDescriptions = {
      beforeafter: 'a Before/After split ad showing a lawn transformation',
      spotsopen:   'a "Spots Open This Week" urgency ad with a service list',
      springoffer: 'a Spring Offer promotional ad with a discount badge',
    };
    const tDesc = templateDescriptions[template] || 'a promotional landscaping ad';

    userPrompt = `You are writing text for ${tDesc} for a landscaping business.

Business: ${biz}
City: ${city}
Service: ${service}
Offer: ${offer || 'Free Estimate'}
CTA/Phone: ${phone || 'Call for Free Estimate'}

Return ONLY a valid JSON object with these exact keys — no markdown, no extra text:
{
  "headline": "A short punchy headline in 4-7 words, ALL CAPS feel, for the ad",
  "subtext": "1-2 short supporting lines. For Spots Open template, write 3-4 services separated by commas like: Lawn Mowing, Edging, Cleanup, Fertilizing",
  "cta": "Short CTA button text, max 6 words, like: Call Now for Free Estimate"
}

Make the copy specific to ${city} and ${service}. Mention the offer naturally.`;

  } else if (type === 'generate') {
    userPrompt = `You are an expert ad copywriter for local landscaping businesses. Write high-converting ads for:
Business: ${biz} | Location: ${city} | Service: ${service} | Offer: ${offer || 'No current offer'} | Target: ${target || 'homeowners'} | Tone: ${tone || 'Professional & Trustworthy'}

Use EXACTLY these section headers for each requested platform:
${platforms.includes('facebook') ? `
===FACEBOOK===
Write a compelling 3-5 sentence Facebook ad. Lead with a local pain point or seasonal hook. Include the offer naturally. Build trust with local credibility. End with a strong CTA. Use 2-3 relevant emojis.` : ''}
${platforms.includes('instagram') ? `
===INSTAGRAM===
Write a punchy 2-3 sentence Instagram caption (casual, engaging, local feel). Then add 12-15 relevant hashtags including a city hashtag. Use emojis.` : ''}
${platforms.includes('google') ? `
===GOOGLE===
H1: [headline max 30 characters]
H2: [headline max 30 characters]
H3: [headline max 30 characters]
D1: [description max 90 characters]
D2: [description max 90 characters]` : ''}
${platforms.includes('tiktok') ? `
===TIKTOK===
Write a 60-second TikTok video script. Include:
HOOK: (first 3 seconds - must stop the scroll)
MAIN: (show the transformation/work)
CTA: (strong close with a call to action)
Use casual, energetic language. Add [on-screen text suggestions] in brackets.` : ''}

Keep all copy specific to ${city} and ${service}. Mention the offer naturally.`;

  } else if (type === 'regen') {
    userPrompt = `Write a NEW variation of a ${platform} ad for ${biz} in ${city} offering ${service}. Try a completely different angle — different hook (pain point, seasonal urgency, social proof, or a question). Keep it platform-appropriate and ready to use immediately.`;
    maxTokens = 400;

  } else if (type === 'idea') {
    userPrompt = `You are a marketing expert for landscaping businesses. Generate ready-to-use "${ideaTitle}" content for ${ideaCat}.
Goal: ${ideaDesc}
Provide:
1. The actual content/copy/script — ready to use immediately, no editing needed
2. 2-3 quick implementation tips specific to landscaping
Be specific to landscaping. Sound authentic, not like a template.`;
    maxTokens = 600;

  } else if (type === 'coach') {
    systemPrompt = 'You are a no-nonsense business coach for landscaping businesses. Give short, practical, actionable advice. Understand challenges like seasonality, finding customers, pricing, getting reviews, competing with lowballers, and social media. Keep answers 3-5 sentences max. No fluff. Sound like a real business owner who has been there.';
    maxTokens = 500;
  }

  try {
    const openaiMessages = [];
    if (systemPrompt) openaiMessages.push({ role: 'system', content: systemPrompt });
    if (type === 'coach') {
      openaiMessages.push(...messages);
    } else {
      openaiMessages.push({ role: 'user', content: userPrompt });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: maxTokens,
        messages: openaiMessages,
        ...(returnJSON ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
    }

    const raw = data.choices?.[0]?.message?.content || '';

    if (returnJSON) {
      try {
        const parsed = JSON.parse(raw);
        return res.status(200).json(parsed);
      } catch (e) {
        // Fallback if JSON parse fails
        return res.status(200).json({ headline: 'Professional Lawn Care', subtext: 'Licensed & Insured • Satisfaction Guaranteed', cta: 'Call Now for Free Estimate' });
      }
    }

    return res.status(200).json({ text: raw });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
