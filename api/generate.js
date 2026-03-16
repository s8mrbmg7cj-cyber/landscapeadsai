// ============================================================
// LandscapeAdsAI — API v8b
// All endpoints return strict { ok: true, ...data } JSON.
// ============================================================
// Required environment variables:
//   OPENAI_API_KEY         — your OpenAI API key
//   STRIPE_SECRET_KEY      — Stripe secret key
//   STRIPE_PUBLISHABLE_KEY — Stripe publishable key
//   STRIPE_PRICE_ID        — Stripe Price ID for $19/mo plan
//   STRIPE_WEBHOOK_SECRET  — webhook signing secret
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  // ── STRIPE: config ───────────────────────────────────────
  if (req.url?.includes('/api/stripe-config')) {
    return res.status(200).json({
      ok: true,
      configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
    });
  }

  // ── STRIPE: checkout session ─────────────────────────────
  if (req.url?.includes('/api/create-checkout')) {
    const sk = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!sk || !priceId) {
      return res.status(200).json({
        ok: false, configured: false,
        error: 'Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to Vercel environment variables.'
      });
    }
    try {
      const { successUrl, cancelUrl } = req.body || {};
      const origin = req.headers.origin || 'https://landscapeadsai.vercel.app';
      const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sk}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          mode: 'subscription',
          success_url: successUrl || `${origin}?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${origin}?cancelled=true`
        })
      });
      const session = await r.json();
      if (!r.ok) return res.status(400).json({ ok: false, error: session.error?.message || 'Stripe error' });
      return res.status(200).json({ ok: true, url: session.url });
    } catch(e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  // ── MAIN AI HANDLER ──────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY is not set in Vercel Environment Variables.' });

  const body = req.body || {};
  const { type } = body;

  // DEBUG: map of handler functions — each returns { ok, ...data } and must NEVER throw
  const handlers = {
    visual:      () => genVisual(apiKey, body),
    variations:  () => genVariations(apiKey, body),
    caption:     () => genCaption(apiKey, body),
    content30:   () => genContent30(apiKey, body),
    generate:    () => genPlatformCopy(apiKey, body),
    regen:       () => regenOne(apiKey, body),
    idea:        () => genIdea(apiKey, body),
    coach:       () => runCoach(apiKey, body),
    offers:      () => genOffers(apiKey, body),
    hashtags:    () => genHashtags(apiKey, body),
    beforeafter: () => genBeforeAfterCaption(apiKey, body),
    seasonal:    () => genSeasonal(apiKey, body),
    reviewad:    () => genReviewAd(apiKey, body),
    leadmagnet:  () => genLeadMagnet(apiKey, body),
    competitor:  () => genCompetitorIdeas(apiKey, body),
  };

  if (!handlers[type]) {
    return res.status(400).json({ ok: false, feature: type || 'unknown', error: `Unknown type: "${type}"`, debug: { type, receivedBody: body } });
  }

  try {
    const result = await handlers[type]();
    // Always attach debug envelope so frontend can log it
    return res.status(200).json({
      ...result,
      debug: { type, feature: type, requestedAt: new Date().toISOString() }
    });
  } catch(e) {
    console.error('API handler error:', type, e.message, e.stack);
    return res.status(500).json({
      ok: false,
      feature: type,
      error: e.message || 'Server error',
      rawText: e.rawText || null,
      stack: e.stack || null,
      debug: { type, feature: type, requestedAt: new Date().toISOString() }
    });
  }
}

// ── HELPERS ──────────────────────────────────────────────

async function callOpenAI(apiKey, messages, { maxTokens = 800, jsonMode = false } = {}) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: maxTokens,
      messages,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
    })
  });
  const data = await r.json();
  if (!r.ok) {
    const err = new Error(data.error?.message || `OpenAI HTTP ${r.status}`);
    err.rawText = JSON.stringify(data);
    throw err;
  }
  const content = data.choices?.[0]?.message?.content || '';
  return content;
}

// Returns { parsed, parseOk, parseError } — never throws
function safeParseJSON(raw, fallback) {
  if (!raw || typeof raw !== 'string') return { parsed: fallback, parseOk: false, parseError: 'raw was empty or not a string', raw };
  try {
    const parsed = JSON.parse(raw);
    return { parsed, parseOk: true, parseError: null, raw };
  } catch(e1) {
    // Try extracting JSON object
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        const parsed = JSON.parse(objMatch[0]);
        return { parsed, parseOk: true, parseError: `Direct parse failed (${e1.message}); extracted JSON object`, raw };
      } catch(e2) {}
    }
    // Try extracting JSON array
    const arrMatch = raw.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try {
        const parsed = JSON.parse(arrMatch[0]);
        return { parsed, parseOk: true, parseError: `Direct parse failed (${e1.message}); extracted JSON array`, raw };
      } catch(e3) {}
    }
    return { parsed: fallback, parseOk: false, parseError: e1.message, raw };
  }
}

function ctx(b) {
  return `Business: ${b.biz || 'Green Valley Landscaping'}
City: ${b.city || 'local area'}
Service: ${b.service || 'lawn care'}
Offer: ${b.offer || 'Free Estimate'}
Phone/CTA: ${b.phone || 'Call for a free estimate'}`;
}

// ── 1. VISUAL AD TEXT ────────────────────────────────────
async function genVisual(apiKey, b) {
  const offerUpper = (b.offer || 'Free Estimate').toUpperCase();
  const cityUpper  = (b.city  || '').toUpperCase();
  const city       = b.city   || 'your area';
  const service    = b.service|| 'lawn care';
  const biz        = b.biz    || 'the business';
  const offer      = b.offer  || 'Free Estimate';
  const tmpl       = b.template || 'promotional';

  // Headline style guide injected into prompt so output quality is consistent
  const headlineGuide = `Headline style: 4-8 words, punchy, feels like a real ad. Examples by angle:
- General:    "A Better Lawn Starts Here" / "Clean Cuts. Great Results." / "Lawn Care Done Right"
- Local:      "${city}'s Trusted Lawn Experts" / "Local Lawn Care You Can Trust"
- Urgency:    "Limited Lawn Spots This Week" / "Book Before Spots Fill"
- Transform:  "From Overgrown To Beautiful" / "The Lawn Your Neighbors Notice"
- Trust:      "Reliable Lawn Care. Guaranteed." / "Local Experts. Proven Results."
- Convenience:"No Hassle. Just Great Lawns." / "Lawn Care Without The Stress"`;

  const supportGuide = `Supporting text style: 1-2 short lines, premium feel, include trust + value signals.
Good examples: "Licensed & Insured • Free Estimates" / "Same-Week Service • Satisfaction Guaranteed" / "Locally Trusted • Fast Response • Quality Work"
Bad examples: "We provide great service" (too vague)`;

  const ctaGuide = `CTA style guide — return exactly 3 strong options as a JSON array.
Mix styles — ideally one free-estimate, one DM/message, and one urgency or discount.

FREE ESTIMATE CTAs:
  "Get Your Free Estimate" / "Book Your Free Lawn Estimate" / "Schedule Your Free Quote"

DISCOUNT CTAs (use when offer includes a discount):
  "Claim ${offerUpper} Today" / "Save ${offerUpper} on Your First Cut" / "Unlock Your Lawn Discount"

URGENCY CTAs:
  "Book Before Spots Fill" / "Limited Spots This Week" / "Reserve Your Lawn Service Now"

DM / MESSAGE CTAs (always include at least one of these — they convert very well):
  'DM "CUT" for a Free Estimate' / 'Message Us "CUT" for Pricing' / 'Text "CUT" to Get Your Quote' / 'Send "CUT" to Claim Your Discount'

PHONE CTAs (only use occasionally, not as the primary):
  "Call Now for Same-Week Service" / "Call Today Before Spots Fill"

Pick the 3 best options for this specific business, service, and offer. Always include at least one DM/message CTA.`;

  const raw = await callOpenAI(apiKey, [
    { role: 'system', content: 'You are a premium landscaping ad copywriter. Always respond with valid JSON only. Never use weak CTAs like "Call Now" or "Contact Us".' },
    {
      role: 'user',
      content: `Write visual ad copy for a ${tmpl} landscaping ad.
Business: ${biz} | City: ${city} | Service: ${service} | Offer: ${offer} | Phone: ${b.phone || 'Call for a free estimate'}

${headlineGuide}

${supportGuide}

${ctaGuide}

Respond with this exact JSON (fill every field, no empty strings):
{
  "headline": "strong 4-8 word headline",
  "supportingText": "1-2 short premium lines with trust signals",
  "ctaText": "best single CTA for the canvas button",
  "ctaOptions": ["option 1", "option 2", "option 3"],
  "offerBadge": "${offerUpper}",
  "trustLine": "Licensed & Insured • Free Estimates • Locally Trusted",
  "detailLine1": "Same-Week Service Available",
  "detailLine2": "Satisfaction Guaranteed",
  "urgencyLine": "Limited spots this week",
  "cityLine": "${cityUpper}"
}`
    }
  ], { maxTokens: 700, jsonMode: true });

  const { parsed: d, parseOk, parseError } = safeParseJSON(raw, {});
  if (!parseOk) {
    return { ok: false, feature: 'visual', error: 'JSON parse failed: ' + parseError, rawText: raw };
  }
  // Ensure ctaOptions is always an array of 3
  const fallbackCtas = [
    'Get Your Free Estimate',
    'DM "CUT" for a Free Estimate',
    'Book Before Spots Fill'
  ];
  const ctaOptions = Array.isArray(d.ctaOptions) && d.ctaOptions.length > 0
    ? d.ctaOptions.slice(0, 3)
    : fallbackCtas;
  return {
    ok:             true,
    feature:        'visual',
    rawText:        raw,
    headline:       d.headline       || `${city}'s Trusted ${service}`,
    supportingText: d.supportingText || 'Licensed & Insured • Free Estimates',
    ctaText:        d.ctaText        || d.cta || ctaOptions[0],
    ctaOptions,
    offerBadge:     d.offerBadge     || offerUpper,
    trustLine:      d.trustLine      || 'Licensed & Insured • Free Estimates • Locally Trusted',
    detailLine1:    d.detailLine1    || 'Same-Week Service Available',
    detailLine2:    d.detailLine2    || 'Satisfaction Guaranteed',
    urgencyLine:    d.urgencyLine    || 'Limited spots available this week',
    cityLine:       d.cityLine       || cityUpper
  };
}

// ── 2. 5 VARIATIONS ─────────────────────────────────────
async function genVariations(apiKey, b) {
  const offer  = b.offer  || 'Free Estimate';
  const city   = b.city   || 'your area';
  const service= b.service|| 'lawn care';

  const raw = await callOpenAI(apiKey, [
    { role: 'system', content: 'You are a premium landscaping ad copywriter. Always respond with valid JSON only. Never use weak CTAs like "Call Now" or "Contact Us".' },
    {
      role: 'user',
      content: `Generate 5 high-converting ad variations for a landscaping business.
Business: ${b.biz || 'the business'} | City: ${city} | Service: ${service} | Offer: ${offer} | Phone: ${b.phone || 'Call for a free estimate'}

5 angles (use in order):
1. Urgency       — scarcity, limited spots, time pressure
2. Transformation — before/after, visual results, dramatic improvement
3. Trust         — licensed, insured, reviews, guarantee, reliability
4. Offer         — lead with the deal/discount, savings front and center
5. Local Authority — city-specific, established presence, community trusted

Headline style (4-8 words, punchy, real-ad feel):
- Urgency:    "Limited Lawn Spots This Week"
- Transform:  "From Overgrown To Beautiful"
- Trust:      "Reliable Lawn Care. Guaranteed."
- Offer:      "Save Big On Your First Cut"
- Local:      "${city}'s Trusted Lawn Experts"

Supporting text style (1-2 short lines, premium, include trust/value signals):
Good: "Licensed & Insured • Free Estimates" / "Same-Week Service • Satisfaction Guaranteed"

CTA style (strong, specific, never "Call Now"):
Good: "Get Your Free Estimate" / "Claim ${offer.toUpperCase()}" / "Book Before Spots Fill" / 'DM "CUT" For A Free Quote'

The offer "${offer}" MUST appear in offerBadge for every variation.

Respond with this exact JSON (variations key required at root):
{
  "variations": [
    {"id":1,"angle":"Urgency","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"${offer.toUpperCase()}","detailLine":"...","trustLine":"..."},
    {"id":2,"angle":"Transformation","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"${offer.toUpperCase()}","detailLine":"...","trustLine":"..."},
    {"id":3,"angle":"Trust","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"${offer.toUpperCase()}","detailLine":"...","trustLine":"..."},
    {"id":4,"angle":"Offer","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"${offer.toUpperCase()}","detailLine":"...","trustLine":"..."},
    {"id":5,"angle":"Local Authority","headline":"...","supportingText":"...","ctaText":"...","offerBadge":"${offer.toUpperCase()}","detailLine":"...","trustLine":"..."}
  ]
}`
    }
  ], { maxTokens: 1800, jsonMode: true });

  const { parsed: d, parseOk, parseError } = safeParseJSON(raw, {});
  if (!parseOk) {
    return { ok: false, feature: 'variations', error: 'JSON parse failed: ' + parseError, rawText: raw, variations: [] };
  }
  let vars = [];
  if (Array.isArray(d)) vars = d;
  else if (Array.isArray(d.variations)) vars = d.variations;
  else {
    for (const key of Object.keys(d)) {
      if (Array.isArray(d[key]) && d[key].length > 0) { vars = d[key]; break; }
    }
  }
  if (vars.length === 0) {
    return { ok: false, feature: 'variations', error: 'Parsed OK but found no variations array. See rawText.', rawText: raw, parsedObject: d, variations: [] };
  }
  vars = vars.map((v, i) => ({
    id:             v.id             || i + 1,
    angle:          v.angle          || 'Variation ' + (i + 1),
    headline:       v.headline       || '',
    supportingText: v.supportingText || '',
    ctaText:        v.ctaText        || v.cta || '',
    offerBadge:     v.offerBadge     || offer.toUpperCase(),
    detailLine:     v.detailLine     || '',
    trustLine:      v.trustLine      || 'Licensed & Insured • Free Estimates'
  }));
  return { ok: true, feature: 'variations', rawText: raw, variations: vars };
}

// ── 3. SOCIAL CAPTION ───────────────────────────────────
async function genCaption(apiKey, b) {
  const raw = await callOpenAI(apiKey, [
    { role: 'system', content: 'You are a social media copywriter for landscaping businesses. Always respond with valid JSON only.' },
    {
      role: 'user',
      content: `Write 3 platform-specific social media captions for a landscaping business.
Business: ${b.biz || 'the business'} | City: ${b.city || 'local area'} | Service: ${b.service || 'lawn care'} | Offer: ${b.offer || 'Free Estimate'} | CTA: ${b.phone || 'Call us today'}

Facebook caption: 3-4 paragraphs, friendly and professional, includes offer prominently, ends with CTA, uses 3-4 checkmarks ✔
Instagram caption: punchy hook line, 2-3 short sentences, emojis, offer and CTA, then 10-12 hashtags on new line
TikTok caption: casual hook to stop the scroll, 2-3 energetic lines, strong CTA, then 8-10 hashtags on new line

Respond with this exact JSON:
{
  "captions": {
    "facebook": "full facebook caption here",
    "instagram": "full instagram caption here",
    "tiktok": "full tiktok caption here"
  }
}`
    }
  ], { maxTokens: 1000, jsonMode: true });

  const { parsed: d, parseOk, parseError } = safeParseJSON(raw, {});
  if (!parseOk) {
    return { ok: false, feature: 'caption', error: 'JSON parse failed: ' + parseError, rawText: raw };
  }
  const caps = d.captions || d;
  const fb = caps.facebook || '';
  const ig = caps.instagram || '';
  const tt = caps.tiktok || '';
  if (!fb && !ig && !tt) {
    return { ok: false, feature: 'caption', error: 'Parsed OK but found no caption fields. See rawText.', rawText: raw, parsedObject: d };
  }
  return { ok: true, feature: 'caption', rawText: raw, captions: { facebook: fb, instagram: ig, tiktok: tt }, facebook: fb, instagram: ig, tiktok: tt };
}

// ── 4. 30-DAY CONTENT PLAN ──────────────────────────────
async function genContent30(apiKey, b) {
  const raw = await callOpenAI(apiKey, [
    { role: 'system', content: 'You are a social media strategist for landscaping businesses. Always respond with valid JSON only.' },
    {
      role: 'user',
      content: `Create a structured 30-day social media content calendar for a landscaping business.
Business: ${b.biz || 'the business'} | City: ${b.city || 'local area'} | Service: ${b.service || 'lawn care'} | Offer: ${b.offer || 'Free Estimate'}

Respond with this exact JSON structure (5 weeks, 6 posts each):
{
  "weeks": [
    {
      "week": 1,
      "theme": "Awareness & Trust",
      "posts": [
        {
          "day": 1,
          "platform": "Instagram",
          "postType": "Before/After",
          "idea": "Show a recent lawn transformation with before/after photos",
          "captionIdea": "Hook: See what we did this week in ${b.city || 'your area'}!",
          "goal": "Engagement"
        }
      ]
    }
  ]
}

Rules:
- 5 weeks total with 6 posts each (days 1-6, 7-12, 13-18, 19-24, 25-30)
- Mix platforms: Instagram, Facebook, TikTok
- Mix postTypes: Before/After, Promo, Tip, Testimonial, Behind-Scenes, Seasonal
- Include the offer "${b.offer || 'Free Estimate'}" in at least 3 posts
- Goals should be one of: Engagement, Leads, Reach, Trust, Awareness
- Make every idea specific to ${b.service || 'lawn care'}`
    }
  ], { maxTokens: 2200, jsonMode: true });

  const { parsed: d, parseOk, parseError } = safeParseJSON(raw, {});
  if (!parseOk) {
    return { ok: false, feature: 'content30', error: 'JSON parse failed: ' + parseError, rawText: raw };
  }
  const weeks = Array.isArray(d.weeks) ? d.weeks : [];
  if (weeks.length === 0) {
    return { ok: false, feature: 'content30', error: 'Parsed OK but found no weeks array. See rawText.', rawText: raw, parsedObject: d };
  }
  return { ok: true, feature: 'content30', rawText: raw, weeks };
}

// ── 5. PLATFORM COPY ────────────────────────────────────
async function genPlatformCopy(apiKey, b) {
  const platforms = b.platforms || ['facebook'];
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Expert ad copywriter for local landscaping businesses.
${ctx(b)}
Target: ${b.target || 'homeowners'} | Tone: ${b.tone || 'Professional & Trustworthy'}

Return ONLY valid JSON with only the requested platforms:
{
  ${platforms.includes('facebook') ? `"facebook": "3-5 sentences. Local pain point opener. Include offer. Trust signals. Strong CTA. 2-3 emojis.",` : ''}
  ${platforms.includes('instagram') ? `"instagram": "2-3 punchy sentences + emojis. Include offer. 12-15 hashtags on new line starting with #",` : ''}
  ${platforms.includes('google') ? `"google": "H1: [max 30 chars]\\nH2: [max 30 chars]\\nH3: [max 30 chars]\\nD1: [max 90 chars - include offer]\\nD2: [max 90 chars - include city and CTA]",` : ''}
  ${platforms.includes('tiktok') ? `"tiktok": "HOOK: [3-sec attention grabber]\\nMAIN: [show the work or transformation]\\nCTA: [direct ask]\\nON-SCREEN: [suggested text overlays in brackets]"` : ''}
}`
  }], { maxTokens: 1200, jsonMode: true });
  const { parsed: d, parseOk, parseError } = safeParseJSON(raw, {});
  const result = { ok: true, feature: 'generate', rawText: raw };
  if (!parseOk) result.parseWarning = 'JSON parse failed: ' + parseError;
  if (platforms.includes('facebook')) result.facebook = d.facebook || (parseOk ? 'Empty field returned.' : 'Parse failed — see rawText.');
  if (platforms.includes('instagram')) result.instagram = d.instagram || (parseOk ? 'Empty field returned.' : 'Parse failed — see rawText.');
  if (platforms.includes('google')) result.google = d.google || (parseOk ? 'Empty field returned.' : 'Parse failed — see rawText.');
  if (platforms.includes('tiktok')) result.tiktok = d.tiktok || (parseOk ? 'Empty field returned.' : 'Parse failed — see rawText.');
  return result;
}

// ── 6. REGEN ONE ─────────────────────────────────────────
async function regenOne(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Write a completely different ${b.platform} ad for a landscaping business.
${ctx(b)}
Use a different angle. Make it local, specific, conversion-focused.
Return ONLY valid JSON: {"text": "..."}`
  }], { maxTokens: 500, jsonMode: true });
  const d = safeParseJSON(raw, {});
  return { ok: true, text: d.text || 'Generation failed.' };
}

// ── 7. CONTENT IDEAS ────────────────────────────────────
async function genIdea(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Marketing expert for landscaping businesses. Generate ready-to-use "${b.ideaTitle}" content for ${b.ideaCat}.
Goal: ${b.ideaDesc}
Return ONLY valid JSON:
{
  "content": "Full post/caption/script ready to use immediately",
  "tips": ["actionable tip 1", "tip 2", "tip 3"]
}`
  }], { maxTokens: 700, jsonMode: true });
  const d = safeParseJSON(raw, {});
  return { ok: true, content: d.content || 'Generation failed.', tips: d.tips || [] };
}

// ── 8. GROWTH COACH ─────────────────────────────────────
async function runCoach(apiKey, b) {
  const messages = [
    { role: 'system', content: `You are a landscaping business growth coach and local marketing expert.
Give short, direct, actionable advice in 3-5 sentences max.
You understand: seasonal challenges, local competition, pricing pressure, getting reviews, social media for trades, running ads on small budgets.
Sound like a successful business owner who has been there, not a corporate consultant.` },
    ...(b.messages || [])
  ];
  const raw = await callOpenAI(apiKey, messages, { maxTokens: 450 });
  return { ok: true, text: raw || 'Try asking again.' };
}

// ── 9. OFFER GENERATOR ───────────────────────────────────
async function genOffers(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Generate 6 high-converting offers for a landscaping business.
${ctx(b)}
Make them specific, believable, and easy to act on. Mix dollar amounts and percentages.
Return ONLY valid JSON:
{
  "offers": [
    {"offer": "...", "type": "Discount", "why": "why this converts well"},
    {"offer": "...", "type": "Bundle", "why": "..."},
    {"offer": "...", "type": "Free Add-on", "why": "..."},
    {"offer": "...", "type": "Referral", "why": "..."},
    {"offer": "...", "type": "Seasonal", "why": "..."},
    {"offer": "...", "type": "New Customer", "why": "..."}
  ]
}`
  }], { maxTokens: 700, jsonMode: true });
  const d = safeParseJSON(raw, { offers: [] });
  return { ok: true, offers: d.offers || [] };
}

// ── 10. HASHTAGS ─────────────────────────────────────────
async function genHashtags(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Generate hashtags for a landscaping business social media post.
${ctx(b)}
Return ONLY valid JSON:
{
  "instagram": ["#tag1", "#tag2"],
  "tiktok": ["#tag1", "#tag2"],
  "tips": "brief strategy tip"
}
Instagram: 15 hashtags mixing niche, local, and broad.
TikTok: 8-10 hashtags focused on trending and niche.
Include city-specific hashtags.`
  }], { maxTokens: 500, jsonMode: true });
  const d = safeParseJSON(raw, { instagram: [], tiktok: [], tips: '' });
  return { ok: true, instagram: d.instagram || [], tiktok: d.tiktok || [], tips: d.tips || '' };
}

// ── 11. BEFORE/AFTER CAPTION ─────────────────────────────
async function genBeforeAfterCaption(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Write a before/after social media caption for a landscaping business.
${ctx(b)}
Return ONLY valid JSON:
{
  "caption": "full caption ready to post",
  "hashtags": "#tag1 #tag2 ..."
}
Caption format:
- Hook line (ALL CAPS + emoji)
- "Before: [description]" line
- "After: [description]" line
- 1-2 sentences about the service
- Offer mention
- CTA
- 8-10 hashtags on a new line`
  }], { maxTokens: 500, jsonMode: true });
  const d = safeParseJSON(raw, {});
  return { ok: true, caption: d.caption || 'Generation failed.', hashtags: d.hashtags || '' };
}

// ── 12. SEASONAL IDEAS ───────────────────────────────────
async function genSeasonal(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Generate seasonal marketing ideas for a landscaping business.
${ctx(b)}
Return ONLY valid JSON:
{
  "spring": [{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."}],
  "summer": [{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."}],
  "fall":   [{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."}],
  "winter": [{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."},{"title":"...","idea":"...","offer":"..."}]
}`
  }], { maxTokens: 900, jsonMode: true });
  const d = safeParseJSON(raw, {});
  return { ok: true, spring: d.spring || [], summer: d.summer || [], fall: d.fall || [], winter: d.winter || [] };
}

// ── 13. REVIEW/TESTIMONIAL AD ────────────────────────────
async function genReviewAd(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Generate a testimonial-style ad for a landscaping business.
${ctx(b)}
Customer review: ${b.reviewText || 'Great service, very professional and on time!'}
Customer name: ${b.reviewerName || 'A Happy Customer'}
Return ONLY valid JSON:
{
  "quote": "cleaned-up review max 2 sentences",
  "headline": "trust-angle headline",
  "supportingText": "1-2 lines supporting the testimonial",
  "cta": "CTA button text",
  "trustLine": "trust signals"
}`
  }], { maxTokens: 500, jsonMode: true });
  const d = safeParseJSON(raw, {});
  return {
    ok: true,
    quote: d.quote || b.reviewText || 'Great service, very professional!',
    headline: d.headline || 'Trusted by Local Homeowners',
    supportingText: d.supportingText || `See why customers recommend ${b.biz || 'us'}.`,
    cta: d.cta || b.phone || 'Call for Free Estimate',
    trustLine: d.trustLine || 'Licensed & Insured • 5-Star Rated'
  };
}

// ── 14. LEAD MAGNET GENERATOR ────────────────────────────
async function genLeadMagnet(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Create 5 lead magnet ideas for a landscaping business that convert ad clicks into leads.
${ctx(b)}
Each lead magnet should be specific, low-friction, and immediately valuable to a homeowner.
Return ONLY valid JSON:
{
  "magnets": [
    {
      "name": "Free Lawn Health Check",
      "headline": "Is Your Lawn Ready for Summer?",
      "description": "We'll inspect your lawn and give you a personalized care plan — completely free.",
      "cta": "Claim Your Free Lawn Check",
      "format": "In-person visit"
    }
  ]
}
Generate 5 magnets. Mix formats: in-person visit, PDF guide, video, checklist, consultation.`
  }], { maxTokens: 900, jsonMode: true });
  const d = safeParseJSON(raw, { magnets: [] });
  return { ok: true, magnets: d.magnets || [] };
}

// ── 15. COMPETITOR AD IDEAS ──────────────────────────────
async function genCompetitorIdeas(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Generate 4 competitor-style ad ideas that a landscaping business could use to stand out.
${ctx(b)}
These are not real competitors — they are strategic angles the business could use to differentiate.
Return ONLY valid JSON:
{
  "ideas": [
    {
      "angle": "Spring Cleanup Special",
      "headline": "Prepare Your Yard for Spring",
      "offer": "$50 off first cleanup service",
      "differentiator": "Why this angle works and how to out-compete it"
    }
  ]
}
Generate 4 ideas. Make them specific to the service and city.`
  }], { maxTokens: 800, jsonMode: true });
  const d = safeParseJSON(raw, { ideas: [] });
  return { ok: true, ideas: d.ideas || [] };
}
