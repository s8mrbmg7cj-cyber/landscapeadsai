export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not set in Vercel Environment Variables.' });

  const { type, biz, city, service, offer, phone, template, target, tone, platforms, platform, messages, ideaTitle, ideaCat, ideaDesc } = req.body;
  let prompt = '', system = '', maxTokens = 1200, json = false;

  if (type === 'visual') {
    json = true; maxTokens = 500;
    const tmap = { beforeafter:'a Before/After transformation split ad', spotsopen:'a Limited Spots Open urgency ad', springoffer:'a Spring Offer promotional ad' };
    prompt = `Write ad copy for ${tmap[template]||'a landscaping ad'}.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer||'Free Estimate'} | CTA: ${phone||'Call for Free Estimate'}
The offer MUST appear prominently. Return ONLY valid JSON (no markdown):
{"headline":"4-7 word punchy headline","subtext":"1-2 supporting lines or comma-separated services","cta":"max 6 word CTA","offerBadge":"${(offer||'').toUpperCase() || 'FREE ESTIMATE'}","trustLine":"Licensed & Insured • Free Estimates","cityLine":"${city.toUpperCase()}"}`;
  }

  else if (type === 'variations') {
    json = true; maxTokens = 1500;
    prompt = `Expert landscaping ad copywriter. Generate exactly 5 ad variations for:
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer||'Free Estimate'} | CTA: ${phone||'Call for Free Estimate'}
Use these 5 angles in order: 1-Urgency, 2-Local Authority, 3-Offer First, 4-Transformation, 5-Trust & Credibility.
The offer "${offer||'Free Estimate'}" MUST appear in EVERY variation's offerBadge.
Return ONLY a valid JSON array (no markdown, no wrapper object):
[{"id":1,"angle":"Urgency","headline":"...","subtext":"...","offerBadge":"...","trustLine":"...","cta":"..."},{"id":2,"angle":"Local Authority","headline":"...","subtext":"...","offerBadge":"...","trustLine":"...","cta":"..."},{"id":3,"angle":"Offer First","headline":"...","subtext":"...","offerBadge":"...","trustLine":"...","cta":"..."},{"id":4,"angle":"Transformation","headline":"...","subtext":"...","offerBadge":"...","trustLine":"...","cta":"..."},{"id":5,"angle":"Trust & Credibility","headline":"...","subtext":"...","offerBadge":"...","trustLine":"...","cta":"..."}]`;
  }

  else if (type === 'caption') {
    maxTokens = 500;
    prompt = `Write a Facebook post caption for a landscaping business to post with their ad image.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer||'Free Estimate'} | CTA: ${phone||'Call for Free Estimate'}
Make it feel local, friendly, direct. Include the offer prominently. Use checkmarks ✔ and relevant emojis. 3-5 short paragraphs. End with the call to action. Start with a bold headline in ALL CAPS.`;
  }

  else if (type === 'content30') {
    maxTokens = 1200;
    prompt = `Create a 30-day social media content calendar for a landscaping business.
Business: ${biz||'a landscaping company'} | City: ${city||'local area'} | Service: ${service||'lawn care'} | Offer: ${offer||'Free Estimate'}
Organize by week (Week 1-5, ~6 posts each). Include post type, platform, and a brief content description.
Mix: before/after posts, seasonal promotions, limited spots urgency, customer testimonial style, lawn tips, service spotlights, referral asks.
Format clearly with Week headers and numbered posts. Be specific and actionable.`;
  }

  else if (type === 'generate') {
    prompt = `Expert ad copywriter for local landscaping businesses.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer||'No offer'} | Target: ${target||'homeowners'} | Tone: ${tone||'Professional'}
${platforms.includes('facebook')?'\n===FACEBOOK===\n3-5 sentence Facebook ad. Local pain point opener. Include offer. Strong CTA. 2-3 emojis.':''}
${platforms.includes('instagram')?'\n===INSTAGRAM===\n2-3 sentence Instagram caption. Casual, local, engaging. 12-15 hashtags including city. Emojis.':''}
${platforms.includes('google')?'\n===GOOGLE===\nH1: [max 30 chars]\nH2: [max 30 chars]\nH3: [max 30 chars]\nD1: [max 90 chars]\nD2: [max 90 chars]':''}
${platforms.includes('tiktok')?'\n===TIKTOK===\nHOOK: (first 3 sec)\nMAIN: (show the work)\nCTA: (strong close)\n[on-screen text in brackets]':''}`;
  }

  else if (type === 'regen') {
    prompt = `New variation of a ${platform} ad for ${biz} in ${city} offering ${service}. Different angle, ready to use.`;
    maxTokens = 400;
  }

  else if (type === 'idea') {
    prompt = `Marketing expert for landscaping businesses. Generate ready-to-use "${ideaTitle}" content for ${ideaCat}.\nGoal: ${ideaDesc}\n1. Actual content — ready to post immediately\n2. 2-3 quick tips\nBe specific to landscaping.`;
    maxTokens = 600;
  }

  else if (type === 'coach') {
    system = 'Landscaping business coach. Short, practical, actionable advice. Max 4 sentences. No fluff.';
    maxTokens = 400;
  }

  try {
    const msgs = [];
    if (system) msgs.push({ role:'system', content:system });
    if (type === 'coach') msgs.push(...messages);
    else msgs.push({ role:'user', content:prompt });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
      body: JSON.stringify({ model:'gpt-4o', max_tokens:maxTokens, messages:msgs, ...(json?{response_format:{type:'json_object'}}:{}) })
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data.error?.message||'OpenAI error' });
    const raw = data.choices?.[0]?.message?.content || '';
    if (json) {
      try {
        const parsed = JSON.parse(raw);
        // handle array wrapped in object
        if (Array.isArray(parsed)) return res.status(200).json({ variations: parsed });
        if (parsed.variations) return res.status(200).json(parsed);
        return res.status(200).json(parsed);
      } catch(e) {
        // try to extract array from raw
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) { try { return res.status(200).json({ variations: JSON.parse(match[0]) }); } catch(e2){} }
        return res.status(200).json({ headline:'Professional Lawn Care', subtext:'Licensed & Insured', cta:'Call for Free Estimate', offerBadge:offer||'FREE ESTIMATE', trustLine:'Licensed & Insured • Free Estimates', cityLine:(city||'').toUpperCase() });
      }
    }
    return res.status(200).json({ text: raw });
  } catch(err) {
    return res.status(500).json({ error: 'Server error. Try again.' });
  }
}
