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

  try {
    switch (type) {
      case 'visual':        return res.status(200).json(await genVisual(apiKey, body));
      case 'variations':    return res.status(200).json(await genVariations(apiKey, body));
      case 'caption':       return res.status(200).json(await genCaption(apiKey, body));
      case 'content30':     return res.status(200).json(await genContent30(apiKey, body));
      case 'generate':      return res.status(200).json(await genPlatformCopy(apiKey, body));
      case 'regen':         return res.status(200).json(await regenOne(apiKey, body));
      case 'idea':          return res.status(200).json(await genIdea(apiKey, body));
      case 'coach':         return res.status(200).json(await runCoach(apiKey, body));
      case 'offers':        return res.status(200).json(await genOffers(apiKey, body));
      case 'hashtags':      return res.status(200).json(await genHashtags(apiKey, body));
      case 'beforeafter':   return res.status(200).json(await genBeforeAfterCaption(apiKey, body));
      case 'seasonal':      return res.status(200).json(await genSeasonal(apiKey, body));
      case 'reviewad':      return res.status(200).json(await genReviewAd(apiKey, body));
      case 'leadmagnet':    return res.status(200).json(await genLeadMagnet(apiKey, body));
      case 'competitor':    return res.status(200).json(await genCompetitorIdeas(apiKey, body));
      default:
        return res.status(400).json({ ok: false, error: `Unknown type: ${type}` });
    }
  } catch(e) {
    console.error('API error:', type, e.message);
    return res.status(500).json({ ok: false, error: 'Server error. Please try again.' });
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
  if (!r.ok) throw new Error(data.error?.message || 'OpenAI API error');
  return data.choices?.[0]?.message?.content || '';
}

function safeParseJSON(raw, fallback) {
  try { return JSON.parse(raw); } catch(e) {
    const obj = raw.match(/\{[\s\S]*\}/);
    if (obj) { try { return JSON.parse(obj[0]); } catch(e2) {} }
    const arr = raw.match(/\[[\s\S]*\]/);
    if (arr) { try { return JSON.parse(arr[0]); } catch(e2) {} }
    return fallback;
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
  const offer = (b.offer || 'Free Estimate').toUpperCase();
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `You are a conversion-focused ad copywriter for local landscaping businesses.
Write visual ad copy for a ${b.template || 'promotional'} ad.
${ctx(b)}

Return ONLY valid JSON — no markdown:
{
  "headline": "4-8 word punchy headline in title case",
  "supportingText": "1-2 supporting lines about the service",
  "cta": "Short CTA button text max 6 words",
  "offerBadge": "${offer}",
  "trustLine": "2-3 trust signals separated by • e.g. Licensed & Insured • Free Estimates • 5-Star Rated",
  "detailLine1": "short value line e.g. Same-Week Service Available",
  "detailLine2": "short value line e.g. Satisfaction Guaranteed",
  "urgencyLine": "short urgency line e.g. Limited spots this week",
  "cityLine": "${(b.city || '').toUpperCase()}"
}`
  }], { maxTokens: 600, jsonMode: true });
  const d = safeParseJSON(raw, {});
  return {
    ok: true,
    headline: d.headline || `Professional ${b.service || 'Lawn Care'}`,
    supportingText: d.supportingText || 'Reliable, professional service you can count on.',
    cta: d.cta || b.phone || 'Call for Free Estimate',
    offerBadge: d.offerBadge || offer,
    trustLine: d.trustLine || 'Licensed & Insured • Free Estimates • Locally Trusted',
    detailLine1: d.detailLine1 || 'Same-Week Service Available',
    detailLine2: d.detailLine2 || 'Satisfaction Guaranteed',
    urgencyLine: d.urgencyLine || 'Limited spots available this week',
    cityLine: d.cityLine || (b.city || '').toUpperCase()
  };
}

// ── 2. 5 VARIATIONS ─────────────────────────────────────
async function genVariations(apiKey, b) {
  const offer = b.offer || 'Free Estimate';
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Expert landscaping ad copywriter. Generate exactly 5 ad variations using 5 different angles.
${ctx(b)}

Angles in order: 1-Urgency, 2-Transformation, 3-Trust, 4-Offer, 5-Local Authority

Rules:
- The offer "${offer}" MUST appear in offerBadge for every variation
- Each headline must be meaningfully different
- All fields required for every variation

Return ONLY valid JSON:
{
  "variations": [
    {"id":1,"angle":"Urgency","headline":"...","supportingText":"...","cta":"...","offerBadge":"...","detailLine":"..."},
    {"id":2,"angle":"Transformation","headline":"...","supportingText":"...","cta":"...","offerBadge":"...","detailLine":"..."},
    {"id":3,"angle":"Trust","headline":"...","supportingText":"...","cta":"...","offerBadge":"...","detailLine":"..."},
    {"id":4,"angle":"Offer","headline":"...","supportingText":"...","cta":"...","offerBadge":"...","detailLine":"..."},
    {"id":5,"angle":"Local Authority","headline":"...","supportingText":"...","cta":"...","offerBadge":"...","detailLine":"..."}
  ]
}`
  }], { maxTokens: 1600, jsonMode: true });
  const d = safeParseJSON(raw, { variations: [] });
  const vars = Array.isArray(d.variations) ? d.variations : [];
  if (vars.length === 0) return { ok: false, error: 'Could not generate variations. Please try again.', variations: [] };
  return { ok: true, variations: vars };
}

// ── 3. SOCIAL CAPTION ───────────────────────────────────
async function genCaption(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Social media copywriter for landscaping businesses. Write 3 platform-specific captions.
${ctx(b)}

Facebook: 3-4 paragraphs, professional but friendly, includes offer, ends with CTA, 3-4 checkmarks ✔
Instagram: punchy hook, 2-3 lines, emojis, offer + CTA, 10-12 relevant hashtags at end
TikTok: casual hook to stop the scroll, 2-3 short lines, high energy, CTA, 8-10 hashtags

Return ONLY valid JSON:
{
  "facebook": "...",
  "instagram": "...",
  "tiktok": "..."
}`
  }], { maxTokens: 900, jsonMode: true });
  const d = safeParseJSON(raw, {});
  if (!d.facebook && !d.instagram && !d.tiktok) return { ok: false, error: 'Caption generation failed. Please try again.' };
  return { ok: true, facebook: d.facebook || '', instagram: d.instagram || '', tiktok: d.tiktok || '' };
}

// ── 4. 30-DAY CONTENT PLAN ──────────────────────────────
async function genContent30(apiKey, b) {
  const raw = await callOpenAI(apiKey, [{
    role: 'user',
    content: `Create a structured 30-day social media content calendar for a landscaping business.
${ctx(b)}

Return ONLY valid JSON:
{
  "weeks": [
    {
      "week": 1,
      "theme": "Awareness & Trust",
      "posts": [
        {
          "day": 1,
          "platform": "Instagram",
          "type": "Before/After",
          "concept": "Show a recent lawn transformation with before/after photos",
          "cta": "DM us for a free quote",
          "goal": "Engagement"
        }
      ]
    }
  ]
}

5 weeks, 6 posts each. Mix platforms (Instagram, Facebook, TikTok). Mix types (Before/After, Promo, Tip, Testimonial, Behind-Scenes, Seasonal). Include offer in at least 3 posts. Each concept specific to ${b.service || 'lawn care'}.`
  }], { maxTokens: 2000, jsonMode: true });
  const d = safeParseJSON(raw, { weeks: [] });
  if (!d.weeks || d.weeks.length === 0) return { ok: false, error: 'Content plan generation failed. Please try again.' };
  return { ok: true, weeks: d.weeks };
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
  const d = safeParseJSON(raw, {});
  const result = { ok: true };
  if (platforms.includes('facebook')) result.facebook = d.facebook || 'Generation failed for Facebook.';
  if (platforms.includes('instagram')) result.instagram = d.instagram || 'Generation failed for Instagram.';
  if (platforms.includes('google')) result.google = d.google || 'Generation failed for Google.';
  if (platforms.includes('tiktok')) result.tiktok = d.tiktok || 'Generation failed for TikTok.';
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
