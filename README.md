# LandscapeAdsAI — Deployment Guide

## What's in this folder

```
landscapeadsai/
├── public/
│   └── index.html        ← Your entire website (all pages)
├── api/
│   └── generate.js       ← The server function that calls the AI safely
├── vercel.json           ← Tells Vercel how to run everything
└── README.md             ← This file
```

---

## How to go live in 10 minutes

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create Key" — name it "LandscapeAdsAI"
5. COPY the key (starts with sk-ant-...) — you won't see it again
6. Add $5-10 credit under "Billing" so it works

### Step 2 — Upload to GitHub
1. Go to https://github.com and sign up (free)
2. Click the "+" button → "New repository"
3. Name it: landscapeadsai
4. Click "Create repository"
5. Click "uploading an existing file"
6. Drag ALL the files from this folder into the upload box
   (make sure you keep the folder structure: api/generate.js and public/index.html)
7. Click "Commit changes"

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Find and select your "landscapeadsai" repository
4. Click "Deploy" (leave all settings as default)
5. Wait ~1 minute for it to build

### Step 4 — Add your API key (THE IMPORTANT PART)
1. Once deployed, go to your project dashboard on Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in the left menu
4. Click "Add New"
5. Name: ANTHROPIC_API_KEY
6. Value: paste your API key (sk-ant-...)
7. Click "Save"
8. Go to "Deployments" tab → click the 3 dots → "Redeploy"

### Step 5 — Your site is live!
Vercel gives you a free URL like: https://landscapeadsai.vercel.app
You can also connect a custom domain (like landscapeadsai.com) in Settings → Domains.

---

## Costs to run this

- Vercel hosting: FREE
- Anthropic API: roughly $0.01-0.03 per ad generation
  - 100 generations/month ≈ $1-3 in API costs
  - If you charge $12/month with 50 users = $600 revenue vs ~$50 API costs

---

## Customizing your site

Everything is in `public/index.html`. It's all in one file so it's easy to edit:
- Change prices → search for "$12"
- Change business name → search for "LandscapeAdsAI"
- Add your email/contact → search for "cta-section"
- Change colors → edit the CSS variables at the top (--green, --bg, etc.)

---

## Adding Stripe payments (when you're ready)

1. Sign up at https://stripe.com
2. Install the Stripe Vercel integration
3. Add a /api/checkout.js function for payment links
4. The free/pro logic in the site can be wired to check Stripe subscriptions

Need help? The AI Coach on the site can actually walk you through it.
