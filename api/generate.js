// ============================================================
// LandscapeAdsAI — API Handler v7
// ============================================================
// Environment variables required:
//   OPENAI_API_KEY       — your OpenAI key
//   STRIPE_SECRET_KEY    — Stripe secret key (for billing)
//   STRIPE_PUBLISHABLE_KEY — Stripe publishable key (sent to frontend)
//   STRIPE_PRICE_ID      — Stripe Price ID for the $19/mo plan
//   STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── STRIPE CHECKOUT SESSION ──────────────────────────────
  // Called when user clicks "Upgrade to Pro"
  if (req.url?.includes('/api/create-checkout')) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!stripeSecretKey || !priceId) {
      return res.status(200).json({
        error: 'Stripe not configured',
        message: 'Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to Vercel environment variables.',
        configured: false
      });
    }
    try {
      const { successUrl, cancelUrl, customerEmail } = req.body;
      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          'mode': 'subscription',
          'success_url': successUrl || `${req.headers.origin}?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
          'cancel_url': cancelUrl || `${req.headers.origin}?cancelled=true`,
          ...(customerEmail ? { customer_email: customerEmail } : {}),
        })
      });
      const session = await stripeRes.json();
      if (!stripeRes.ok) return res.status(400).json({ error: session.error?.message || 'Stripe error' });
      return res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (err) {
      return res.status(500).json({ error: 'Checkout creation failed: ' + err.message });
    }
  }

  // ── STRIPE CONFIG (send publishable key to frontend) ─────
  if (req.url?.includes('/api/stripe-config')) {
    return res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
      priceId: process.env.STRIPE_PRICE_ID || null,
      configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID)
    });
  }

  // ── MAIN AI HANDLER ──────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not set in Vercel Environment Variables.' });

  const {
    type, biz, city, service, offer, phone, template,
    target, tone, platforms, platform, messages,
    ideaTitle, ideaCat, ideaDesc
  } = req.body || {};

  let prompt = '', system = '', maxTokens = 1200, useJson = false;

  // ── VISUAL AD TEXT (single) ───────────────────────────────
  if (type === 'visual') {
    useJson = true; maxTokens = 600;
    const tDesc = {
      beforeafter: 'a Before/After lawn transformation ad',
      spotsopen: 'a Limited Spots Open urgency ad',
      springoffer: 'a Spring Offer promotional ad',
      testimonial: 'a Customer Testimonial / Social Proof ad',
      multiservice: 'a Multi-Service Promo ad listing multiple services'
    }[template] || 'a professional landscaping ad';

    prompt = `You are a conversion-focused ad copywriter for local landscaping businesses.
Write ad copy for ${tDesc}.
Business: ${biz || 'the business'} | City: ${city || ''} | Service: ${service || 'lawn care'} | Offer: ${offer || 'Free Estimate'} | CTA: ${phone || 'Call for Free Estimate'}

Rules:
- The offer "${offer || 'Free Estimate'}" MUST appear in offerBadge, clearly and prominently
- headline should be punchy, 4-8 words, ALL CAPS feel
- subtext should be 1-2 supporting lines relevant to the service
- trustLine should include 2-3 trust signals separated by • (e.g. Licensed & Insured • Free Estimates • Fast Response)
- detailLine1 and detailLine2 add persuasive supporting details (e.g. "Same-Week Service Available" / "Satisfaction Guaranteed")
- urgencyLine adds scarcity or time pressure (e.g. "Limited spots this week" / "Book before spots fill up")

Return ONLY valid JSON, no markdown, no explanation:
{
  "headline": "...",
  "subtext": "...",
  "offerBadge": "${(offer || 'FREE ESTIMATE').toUpperCase()}",
  "cta": "...",
  "trustLine": "Licensed & Insured • Free Estimates • Locally Trusted",
  "detailLine1": "...",
  "detailLine2": "...",
  "urgencyLine": "...",
  "cityLine": "${(city || '').toUpperCase()}"
}`;
  }

  // ── 5 VARIATIONS ─────────────────────────────────────────
  else if (type === 'variations') {
    useJson = true; maxTokens = 1800;
    prompt = `You are an expert landscaping ad copywriter. Generate exactly 5 ad variations.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer || 'Free Estimate'} | CTA: ${phone || 'Call for Free Estimate'}

Use these 5 angles IN ORDER:
1. Urgency — limited spots, time pressure, act now
2. Local Authority — city-specific, established, trusted in area
3. Offer First — lead with the deal/discount front and center
4. Transformation — before/after, results, visual outcome
5. Trust & Credibility — licensed, insured, reviews, guarantee

CRITICAL: The offer "${offer || 'Free Estimate'}" MUST appear in EVERY variation's offerBadge field.

Return ONLY a valid JSON array — no markdown, no wrapper object, just the array:
[
  {"id":1,"angle":"Urgency","headline":"...","subtext":"...","offerBadge":"...","cta":"...","detailLine":"..."},
  {"id":2,"angle":"Local Authority","headline":"...","subtext":"...","offerBadge":"...","cta":"...","detailLine":"..."},
  {"id":3,"angle":"Offer First","headline":"...","subtext":"...","offerBadge":"...","cta":"...","detailLine":"..."},
  {"id":4,"angle":"Transformation","headline":"...","subtext":"...","offerBadge":"...","cta":"...","detailLine":"..."},
  {"id":5,"angle":"Trust & Credibility","headline":"...","subtext":"...","offerBadge":"...","cta":"...","detailLine":"..."}
]`;
  }

  // ── SOCIAL CAPTION ───────────────────────────────────────
  else if (type === 'caption') {
    maxTokens = 500;
    prompt = `Write a social media caption for a landscaping business to post with their ad image.
Works for Facebook, Instagram, and TikTok.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer || 'Free Estimate'} | CTA: ${phone || 'Call for free estimate'}

Requirements:
- Start with a bold hook line in ALL CAPS (2-5 words + emoji)
- 3-4 short punchy paragraphs
- Include the offer clearly in the second paragraph
- Use 3-4 checkmarks ✔ for key selling points
- End with a direct call to action
- Add 8-12 relevant hashtags on the final line (mix local + service + seasonal)
- Keep it authentic, local, and direct — not corporate`;
  }

  // ── 30-DAY CONTENT CALENDAR ───────────────────────────────
  else if (type === 'content30') {
    maxTokens = 1400;
    prompt = `Create a structured 30-day social media content calendar for a landscaping business.
Business: ${biz || 'a landscaping company'} | City: ${city || 'local area'} | Service: ${service || 'lawn care'} | Offer: ${offer || 'Free Estimate'}

Format EXACTLY like this — 5 weeks, 6 posts per week:

WEEK 1 — Awareness & Trust
Day 1 | Instagram | Before/After Photo | [specific caption concept] | Goal: Engagement
Day 2 | Facebook | Service Spotlight | [specific caption concept] | Goal: Reach
...

Rules:
- Mix platforms: Instagram, Facebook, TikTok
- Mix post types: Before/After, Promo, Tip, Testimonial, Behind-the-Scenes, Seasonal
- Make each concept specific and actionable — not vague
- Include seasonal relevance
- Include offer in at least 3 posts
- End each line with a clear Goal (Engagement / Leads / Reach / Trust)`;
  }

  // ── MULTI-PLATFORM TEXT ADS ──────────────────────────────
  else if (type === 'generate') {
    prompt = `Expert ad copywriter for local landscaping businesses.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer || 'no offer specified'} | Target: ${target || 'homeowners'} | Tone: ${tone || 'Professional & Trustworthy'}

Write platform-optimized copy for each requested platform. Use these EXACT section headers:
${(platforms || []).includes('facebook') ? `
===FACEBOOK===
3-5 sentences. Local pain point opener. Include offer prominently. Trust signals. Strong CTA. 2-3 emojis. Sound local and authentic.` : ''}
${(platforms || []).includes('instagram') ? `
===INSTAGRAM===
2-3 punchy sentences. Casual, visual, local. Include offer. 12-15 hashtags on a new line. Relevant emojis.` : ''}
${(platforms || []).includes('google') ? `
===GOOGLE===
H1: [max 30 characters]
H2: [max 30 characters]
H3: [max 30 characters]
D1: [max 90 characters — include offer]
D2: [max 90 characters — include city and CTA]` : ''}
${(platforms || []).includes('tiktok') ? `
===TIKTOK===
HOOK: (0-3 sec — stop the scroll)
MAIN: (show the transformation or service in action)
CTA: (direct ask — book, call, DM)
[Suggested on-screen text in brackets]` : ''}`;
  }

  // ── REGENERATE ONE ────────────────────────────────────────
  else if (type === 'regen') {
    prompt = `Write a completely different ${platform} ad for ${biz} in ${city} offering ${service}. 
Use a different angle than typical ads. Make it local, specific, and conversion-focused. Ready to use immediately.`;
    maxTokens = 400;
  }

  // ── IDEAS ─────────────────────────────────────────────────
  else if (type === 'idea') {
    prompt = `Marketing expert for landscaping businesses. Generate ready-to-use "${ideaTitle}" content for ${ideaCat}.
Goal: ${ideaDesc}
1. Actual post content / caption / script — ready to use immediately, no editing needed
2. 2-3 quick implementation tips specific to landscaping
Be specific, actionable, and local-service focused.`;
    maxTokens = 700;
  }

  // ── GROWTH COACH ──────────────────────────────────────────
  else if (type === 'coach') {
    system = `You are a landscaping business growth coach and local marketing expert. 
You give short, direct, actionable advice. You understand: seasonal revenue challenges, local competition, pricing pressure, getting reviews, social media for trades, and running ads on small budgets.
Keep answers to 3-5 sentences max. No corporate fluff. Sound like a successful business owner who has been there.`;
    maxTokens = 450;
  }

  // ── CALL AI ───────────────────────────────────────────────
  try {
    const msgs = [];
    if (system) msgs.push({ role: 'system', content: system });
    if (type === 'coach') {
      msgs.push(...(messages || []));
    } else {
      msgs.push({ role: 'user', content: prompt });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: maxTokens,
        messages: msgs,
        ...(useJson ? { response_format: { type: 'json_object' } } : {})
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'OpenAI error' });

    const raw = data.choices?.[0]?.message?.content || '';

    if (useJson) {
      // Try to parse structured response
      try {
        const parsed = JSON.parse(raw);
        // For variations: might be array directly or {variations:[...]} or an object with numbered keys
        if (type === 'variations') {
          let vars = [];
          if (Array.isArray(parsed)) vars = parsed;
          else if (parsed.variations && Array.isArray(parsed.variations)) vars = parsed.variations;
          else {
            // Try extracting from any array-valued property
            for (const key of Object.keys(parsed)) {
              if (Array.isArray(parsed[key]) && parsed[key].length > 0) { vars = parsed[key]; break; }
            }
          }
          // If still empty, try raw array extraction
          if (vars.length === 0) {
            const match = raw.match(/\[[\s\S]*\]/);
            if (match) vars = JSON.parse(match[0]);
          }
          return res.status(200).json({ variations: vars });
        }
        return res.status(200).json(parsed);
      } catch (e) {
        // Fallback for visual
        if (type === 'visual') {
          return res.status(200).json({
            headline: `${(service || 'LAWN CARE').toUpperCase()} IN ${(city || 'YOUR AREA').toUpperCase()}`,
            subtext: 'Professional • Reliable • Locally Trusted',
            offerBadge: (offer || 'FREE ESTIMATE').toUpperCase(),
            cta: phone || 'Call for Free Estimate',
            trustLine: 'Licensed & Insured • Free Estimates • Fast Response',
            detailLine1: 'Same-Week Service Available',
            detailLine2: 'Satisfaction Guaranteed',
            urgencyLine: 'Limited spots this week',
            cityLine: (city || '').toUpperCase()
          });
        }
        return res.status(200).json({ variations: [], error: 'Parse failed' });
      }
    }

    return res.status(200).json({ text: raw });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
