// ============================================================
// LandscapeAdsAI — api/generate.js (Stable MVP)
// Single route: POST /api/generate
// ALL responses: { ok: true, ...data } or { ok: false, error: "..." }
// NEVER returns plain text, NEVER crashes, NEVER returns undefined
// ============================================================
// Required env vars (set in Vercel > Settings > Environment Variables):
//   OPENAI_API_KEY
//   STRIPE_SECRET_KEY
//   STRIPE_PUBLISHABLE_KEY
//   STRIPE_PRICE_ID
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Stripe: config
  if (req.url?.includes('/api/stripe-config')) {
    return res.status(200).json({
      ok: true,
      configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
    });
  }

  // Stripe: checkout
  if (req.url?.includes('/api/create-checkout')) {
    const sk = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!sk || !priceId) {
      return res.status(200).json({ ok: false, configured: false, error: 'Stripe not configured.' });
    }
    try {
      const { successUrl, cancelUrl } = req.body || {};
      const origin = req.headers.origin || 'https://landscapeadsai.vercel.app';
      const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + sk, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          mode: 'subscription',
          success_url: successUrl || (origin + '?upgraded=true'),
          cancel_url:  cancelUrl  || (origin + '?cancelled=true')
        })
      });
      const session = await r.json();
      if (!r.ok) return res.status(400).json({ ok: false, error: session.error?.message || 'Stripe error' });
      return res.status(200).json({ ok: true, url: session.url });
    } catch(e) {
      return res.status(500).json({ ok: false, error: e.message || 'Stripe error' });
    }
  }

  // Main AI handler
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY not set. Add it in Vercel > Settings > Environment Variables.' });
  }

  const body = req.body || {};
  const type = String(body.type || '');

  const HANDLERS = {
    visual:     () => genVisual(apiKey, body),
    variations: () => genVariations(apiKey, body),
    caption:    () => genCaption(apiKey, body),
    content30:  () => genContent30(apiKey, body),
    coach:      () => runCoach(apiKey, body),
  };

  if (!HANDLERS[type]) {
    return res.status(400).json({ ok: false, error: 'Unknown type: "' + type + '". Valid: ' + Object.keys(HANDLERS).join(', ') });
  }

  try {
    const result = await HANDLERS[type]();
    const safe = (result && typeof result === 'object') ? result : { ok: false, error: 'Handler returned invalid data' };
    return res.status(200).json(safe);
  } catch(e) {
    console.error('[generate.js] type=' + type, e.message);
    return res.status(500).json({ ok: false, error: e.message || 'Server error. Please try again.' });
  }
}

// ── HELPERS ──────────────────────────────────────────────────

async function callAI(apiKey, messages, maxTokens) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: maxTokens || 800,
      messages,
      response_format: { type: 'json_object' }
    })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || 'OpenAI HTTP ' + r.status);
  return data.choices?.[0]?.message?.content || '';
}

function safeJSON(raw) {
  if (!raw) return { d: null, ok: false, err: 'Empty AI response' };
  try { return { d: JSON.parse(raw), ok: true, err: null }; } catch(e1) {}
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) { try { return { d: JSON.parse(m[0]), ok: true, err: null }; } catch(e2) {} }
  return { d: null, ok: false, err: 'JSON parse failed. AI returned: ' + raw.slice(0, 100) };
}

function ctx(b) {
  return 'Business: ' + (b.biz || 'the business') +
    '\nCity: ' + (b.city || 'local area') +
    '\nService: ' + (b.service || 'lawn care') +
    '\nOffer: ' + (b.offer || 'Free Estimate') +
    '\nPhone/CTA: ' + (b.phone || 'Call for a free estimate');
}

// ── 1. VISUAL AD ─────────────────────────────────────────────

async function genVisual(apiKey, b) {
  const offerUp  = (b.offer || 'Free Estimate').toUpperCase();
  const cityUp   = (b.city  || '').toUpperCase();
  const service  = b.service || 'lawn care';
  const city     = b.city    || 'local area';

  const raw = await callAI(apiKey, [
    { role: 'system', content: 'Landscaping ad copywriter. Always respond with valid JSON only. Never leave any field empty.' },
    { role: 'user', content: 'Write visual ad copy for a ' + (b.template || 'promotional') + ' landscaping ad.\n' + ctx(b) + '\n\nHeadline style: 4-8 words, punchy (e.g. "Perfect Lawn Without The Work" / "' + city + ' Lawn Care Done Right")\nCTA style: specific and strong (e.g. "Get Your Free Estimate" / "DM \\"CUT\\" For A Free Quote")\nSupporting text: 1-2 lines with trust signals\n\nReturn ONLY this JSON:\n{\n  "headline": "4-8 word punchy headline",\n  "supportingText": "1-2 lines with trust signals",\n  "ctaText": "strong specific CTA",\n  "ctaOptions": ["option1", "option2", "option3"],\n  "offerBadge": "' + offerUp + '",\n  "trustLine": "Licensed & Insured • Free Estimates • Locally Trusted",\n  "detailLine1": "service detail e.g. Same-Week Service Available",\n  "detailLine2": "another detail e.g. Satisfaction Guaranteed",\n  "urgencyLine": "urgency e.g. Limited spots this week",\n  "cityLine": "' + cityUp + '"\n}' }
  ], 700);

  const { d, ok, err } = safeJSON(raw);
  if (!ok || !d) return { ok: false, error: err || 'Visual ad generation failed' };

  const fallback = ['Get Your Free Estimate', 'Book Before Spots Fill', 'Claim ' + offerUp + ' Today'];
  const opts = Array.isArray(d.ctaOptions) && d.ctaOptions.length > 0 ? d.ctaOptions.slice(0, 3) : fallback;

  return {
    ok:             true,
    headline:       d.headline       || 'Professional ' + service,
    supportingText: d.supportingText || 'Licensed & Insured • Free Estimates',
    ctaText:        d.ctaText        || d.cta || opts[0],
    ctaOptions:     opts,
    offerBadge:     d.offerBadge     || offerUp,
    trustLine:      d.trustLine      || 'Licensed & Insured • Free Estimates • Locally Trusted',
    detailLine1:    d.detailLine1    || 'Same-Week Service Available',
    detailLine2:    d.detailLine2    || 'Satisfaction Guaranteed',
    urgencyLine:    d.urgencyLine    || 'Limited spots available this week',
    cityLine:       d.cityLine       || cityUp
  };
}

// ── 2. VARIATIONS ────────────────────────────────────────────

async function genVariations(apiKey, b) {
  const offer  = b.offer   || 'Free Estimate';
  const offerUp = offer.toUpperCase();

  const raw = await callAI(apiKey, [
    { role: 'system', content: 'Landscaping ad copywriter. Always respond with valid JSON only. Never leave any field empty.' },
    { role: 'user', content: 'Generate exactly 5 ad variations for a landscaping business.\n' + ctx(b) + '\n\n5 angles in order:\n1. Urgency — scarcity, limited spots, act now\n2. Limited Offer — lead with the discount\n3. Premium Quality — craftsmanship, results\n4. Convenience — no hassle, easy process\n5. Neighborhood Trust — local, community, trusted nearby\n\nRules:\n- offerBadge MUST be "' + offerUp + '" for all 5\n- Headline: 4-8 words, punchy real-ad style\n- ctaText: strong and specific, never just "Call Now"\n- All fields required for all 5\n\nReturn ONLY this JSON:\n{\n  "variations": [\n    {"id":1,"angle":"Urgency","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"' + offerUp + '","detailLine":"...","trustLine":"Licensed & Insured • Free Estimates"},\n    {"id":2,"angle":"Limited Offer","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"' + offerUp + '","detailLine":"...","trustLine":"Licensed & Insured • Free Estimates"},\n    {"id":3,"angle":"Premium Quality","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"' + offerUp + '","detailLine":"...","trustLine":"Licensed & Insured • Satisfaction Guaranteed"},\n    {"id":4,"angle":"Convenience","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"' + offerUp + '","detailLine":"...","trustLine":"Licensed & Insured • Free Estimates"},\n    {"id":5,"angle":"Neighborhood Trust","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"' + offerUp + '","detailLine":"...","trustLine":"Locally Trusted • Free Estimates"}\n  ]\n}' }
  ], 1600);

  const { d, ok, err } = safeJSON(raw);
  if (!ok || !d) return { ok: false, error: err || 'Variations generation failed' };

  let vars = [];
  if (Array.isArray(d)) vars = d;
  else if (Array.isArray(d.variations)) vars = d.variations;
  else { for (const k of Object.keys(d)) { if (Array.isArray(d[k]) && d[k].length > 0) { vars = d[k]; break; } } }

  if (vars.length === 0) return { ok: false, error: 'No variations returned. Please try again.' };

  vars = vars.map((v, i) => ({
    id:             v.id             || i + 1,
    angle:          v.angle          || 'Variation ' + (i + 1),
    headline:       v.headline       || '',
    supportingText: v.supportingText || '',
    ctaText:        v.ctaText        || v.cta || 'Get Your Free Estimate',
    offerBadge:     v.offerBadge     || offerUp,
    detailLine:     v.detailLine     || '',
    trustLine:      v.trustLine      || 'Licensed & Insured • Free Estimates'
  }));

  return { ok: true, variations: vars };
}

// ── 3. CAPTION ───────────────────────────────────────────────

async function genCaption(apiKey, b) {
  const raw = await callAI(apiKey, [
    { role: 'system', content: 'Social media copywriter for landscaping businesses. Always respond with valid JSON only.' },
    { role: 'user', content: 'Write 3 social media captions for a landscaping business.\n' + ctx(b) + '\n\nFacebook: 3-4 short paragraphs, professional, checkmarks ✔, include offer, end with CTA.\nInstagram: hook line, 2-3 punchy sentences with emojis, offer, CTA, then 10-12 hashtags.\nShort: 1-2 sentences only, include offer and CTA, works anywhere.\n\nReturn ONLY this JSON:\n{\n  "captions": {\n    "facebook": "full caption here",\n    "instagram": "full caption with hashtags here",\n    "shortCaption": "short version here"\n  }\n}' }
  ], 900);

  const { d, ok, err } = safeJSON(raw);
  if (!ok || !d) return { ok: false, error: err || 'Caption generation failed' };

  const caps  = d.captions || d;
  const fb    = caps.facebook     || d.facebook     || '';
  const ig    = caps.instagram    || d.instagram    || '';
  const short = caps.shortCaption || caps.tiktok    || d.tiktok || '';

  if (!fb && !ig && !short) return { ok: false, error: 'AI returned empty captions. Please try again.' };
  return { ok: true, captions: { facebook: fb, instagram: ig, shortCaption: short }, facebook: fb, instagram: ig, tiktok: short };
}

// ── 4. 30-DAY CONTENT PLAN ───────────────────────────────────

async function genContent30(apiKey, b) {
  const service = b.service || 'lawn care';
  const city    = b.city    || 'local area';
  const offer   = b.offer   || 'Free Estimate';

  const raw = await callAI(apiKey, [
    { role: 'system', content: 'Social media strategist for landscaping businesses. Always respond with valid JSON only.' },
    { role: 'user', content: '30-day social media content plan for a landscaping business.\n' + ctx(b) + '\n\n4 weeks, 4 posts each (16 total). Mix platforms: Instagram, Facebook, TikTok. Mix types: Before/After, Promo, Tip, Testimonial, Behind-Scenes, Seasonal. Include "' + offer + '" in at least 2 posts. Specific to "' + service + '" in "' + city + '".\n\nReturn ONLY this JSON:\n{\n  "weeks": [\n    {\n      "week": 1, "theme": "Build Awareness",\n      "posts": [\n        {"day":1,"platform":"Instagram","postType":"Before/After","idea":"specific real idea for ' + service + '","captionIdea":"caption concept","goal":"Engagement"},\n        {"day":2,"platform":"Facebook","postType":"Promo","idea":"specific real idea","captionIdea":"caption concept","goal":"Leads"},\n        {"day":4,"platform":"TikTok","postType":"Behind-Scenes","idea":"specific real idea","captionIdea":"caption concept","goal":"Reach"},\n        {"day":6,"platform":"Instagram","postType":"Tip","idea":"lawn care tip","captionIdea":"caption concept","goal":"Trust"}\n      ]\n    },\n    {\n      "week": 2, "theme": "Promote Your Offer",\n      "posts": [\n        {"day":8,"platform":"Facebook","postType":"Promo","idea":"specific offer post for ' + offer + '","captionIdea":"caption concept","goal":"Leads"},\n        {"day":9,"platform":"Instagram","postType":"Before/After","idea":"specific real idea","captionIdea":"caption concept","goal":"Engagement"},\n        {"day":11,"platform":"TikTok","postType":"Testimonial","idea":"specific real idea","captionIdea":"caption concept","goal":"Trust"},\n        {"day":13,"platform":"Instagram","postType":"Seasonal","idea":"seasonal post idea","captionIdea":"caption concept","goal":"Reach"}\n      ]\n    },\n    {\n      "week": 3, "theme": "Build Trust",\n      "posts": [\n        {"day":15,"platform":"Instagram","postType":"Testimonial","idea":"specific real idea","captionIdea":"caption concept","goal":"Trust"},\n        {"day":16,"platform":"Facebook","postType":"Tip","idea":"lawn care tip","captionIdea":"caption concept","goal":"Engagement"},\n        {"day":18,"platform":"TikTok","postType":"Behind-Scenes","idea":"specific real idea","captionIdea":"caption concept","goal":"Reach"},\n        {"day":20,"platform":"Instagram","postType":"Promo","idea":"specific offer post for ' + offer + '","captionIdea":"caption concept","goal":"Leads"}\n      ]\n    },\n    {\n      "week": 4, "theme": "Drive Bookings",\n      "posts": [\n        {"day":22,"platform":"Facebook","postType":"Promo","idea":"urgency post — limited spots","captionIdea":"caption concept","goal":"Leads"},\n        {"day":23,"platform":"Instagram","postType":"Before/After","idea":"transformation post","captionIdea":"caption concept","goal":"Engagement"},\n        {"day":25,"platform":"TikTok","postType":"Seasonal","idea":"seasonal post idea","captionIdea":"caption concept","goal":"Reach"},\n        {"day":27,"platform":"Instagram","postType":"Testimonial","idea":"specific real idea","captionIdea":"caption concept","goal":"Trust"}\n      ]\n    }\n  ]\n}\nReplace every placeholder with real content for ' + service + ' in ' + city + '.' }
  ], 2200);

  const { d, ok, err } = safeJSON(raw);
  if (!ok || !d) return { ok: false, error: err || 'Content plan generation failed' };

  const weeks = Array.isArray(d.weeks) ? d.weeks : [];
  if (weeks.length === 0) return { ok: false, error: 'No content weeks returned. Please try again.' };
  return { ok: true, weeks };
}

// ── 5. COACH ─────────────────────────────────────────────────

async function runCoach(apiKey, b) {
  const messages = [
    {
      role: 'system',
      content: 'You are a landscaping business growth coach. Give short, direct, actionable advice in 3-5 sentences. Sound like a successful business owner, not a corporate consultant.'
    },
    ...(Array.isArray(b.messages) ? b.messages : [])
  ];

  // Coach uses plain-text mode (no json_object)
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({ model: 'gpt-4o', max_tokens: 450, messages })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || 'OpenAI error');
  const text = data.choices?.[0]?.message?.content || '';
  return { ok: true, text: text || 'Try asking again.' };
}
