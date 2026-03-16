<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LandscapeAdsAI — Visual Ad Creator for Landscaping Businesses</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d1117;--bg2:#161b22;--bg3:#1c2128;--bg4:#21262d;
  --g:#2ea043;--g2:#3fb950;--g3:#56d364;
  --border:#30363d;--b2:#21262d;
  --t:#e6edf3;--t2:#8b949e;--t3:#6e7681;
  --gold:#facc15;--red:#ef4444;--blue:#3b82f6;
  --font:'Inter',sans-serif;--font2:'Oswald',sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--t);overflow-x:hidden;font-size:15px;line-height:1.6}
nav{background:rgba(13,17,23,.97);border-bottom:1px solid var(--border);padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:300;backdrop-filter:blur(16px)}
.logo{display:flex;align-items:center;gap:10px;cursor:pointer}
.logo-icon{width:36px;height:36px;background:var(--g);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
.logo-text{font-size:17px;font-weight:800;letter-spacing:-.3px}
.nav-links{display:flex;align-items:center;gap:4px}
.nav-btn{background:none;border:none;color:var(--t2);font-size:14px;font-weight:500;padding:7px 14px;border-radius:7px;cursor:pointer;font-family:var(--font);transition:all .15s}
.nav-btn:hover{color:var(--t);background:var(--bg3)}
.nav-btn.act{color:var(--g2);background:rgba(46,160,67,.08)}
.nav-cta{background:var(--g);color:white;border:none;font-size:14px;font-weight:700;padding:9px 20px;border-radius:9px;cursor:pointer;font-family:var(--font);transition:all .15s;margin-left:8px}
.nav-cta:hover{background:var(--g2);transform:translateY(-1px)}
.plan-pro{display:inline-flex;align-items:center;gap:6px;background:rgba(46,160,67,.15);border:1px solid rgba(46,160,67,.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700;color:var(--g2);margin-left:6px}
.plan-free{display:inline-flex;align-items:center;gap:6px;background:rgba(139,148,158,.1);border:1px solid var(--border);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700;color:var(--t2);margin-left:6px;cursor:pointer;transition:all .15s}
.plan-free:hover{border-color:var(--g);color:var(--g2)}
.page{display:none}.page.active{display:block}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:500;display:none;align-items:center;justify-content:center;padding:20px}
.overlay.open{display:flex}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:40px;max-width:500px;width:100%;position:relative;max-height:90vh;overflow-y:auto}
.modal-x{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--t3);font-size:20px;cursor:pointer;padding:4px;line-height:1}
.modal-x:hover{color:var(--t)}
.modal h2{font-size:24px;font-weight:800;letter-spacing:-.5px;margin-bottom:8px}
.modal>p{font-size:14px;color:var(--t2);line-height:1.6;margin-bottom:20px}
.modal-feats{display:flex;flex-direction:column;gap:9px;margin-bottom:22px}
.modal-feat{display:flex;align-items:center;gap:9px;font-size:14px;color:var(--t2)}
.mfck{color:var(--g2);font-size:15px;flex-shrink:0}
.stripe-btn{width:100%;padding:16px;background:var(--g);color:white;border:none;border-radius:12px;font-size:16px;font-weight:800;cursor:pointer;font-family:var(--font);transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.stripe-btn:hover{background:var(--g2);transform:translateY(-1px)}
.stripe-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.stripe-note{font-size:12px;color:var(--t3);text-align:center;margin-top:10px}
.dev-note{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12px;color:var(--t2);line-height:1.6;margin-top:14px;display:none}
.dev-note code{font-size:11px;background:var(--bg4);padding:1px 5px;border-radius:4px;color:var(--g3)}

/* WM BANNER */
.wm-banner{background:rgba(46,160,67,.07);border:1px solid rgba(46,160,67,.18);border-radius:10px;padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.wm-banner p{font-size:12px;color:var(--t2);line-height:1.4}
.wm-banner strong{color:var(--g2)}
.wm-banner button{background:var(--g);color:white;border:none;border-radius:7px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font);white-space:nowrap;flex-shrink:0}
.wm-banner button:hover{background:var(--g2)}

/* HERO */
.hero{padding:100px 48px 88px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 72% 62% at 50% 0%,rgba(46,160,67,.14) 0%,transparent 65%);pointer-events:none}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(46,160,67,.1);border:1px solid rgba(46,160,67,.22);padding:7px 16px;border-radius:100px;font-size:13px;color:var(--g3);font-weight:600;margin-bottom:28px;position:relative}
.eyedot{width:7px;height:7px;background:var(--g3);border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
.hero h1{font-size:clamp(38px,6vw,72px);font-weight:900;line-height:1.03;letter-spacing:-2.5px;margin-bottom:22px;position:relative}
.hero h1 em{font-style:normal;color:var(--g2)}
.hero-sub{font-size:19px;color:var(--t2);max-width:560px;margin:0 auto 14px;line-height:1.65;position:relative}
.hero-sub strong{color:var(--t);font-weight:600}
.hero-proof{font-size:14px;color:var(--t3);margin-bottom:40px;position:relative}
.hero-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative}
.btn-hero{background:var(--g);color:white;border:none;font-size:17px;font-weight:800;padding:16px 36px;border-radius:12px;cursor:pointer;font-family:var(--font);transition:all .2s}
.btn-hero:hover{background:var(--g2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(46,160,67,.3)}
.btn-ghost{background:transparent;color:var(--t);border:1px solid rgba(255,255,255,.15);font-size:15px;font-weight:500;padding:16px 28px;border-radius:12px;cursor:pointer;font-family:var(--font);transition:all .15s}
.btn-ghost:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.04)}
.hero-trust{color:var(--t3);font-size:13px;margin-top:18px;position:relative}
.hero-trust span{margin:0 10px}
.stats-row{display:flex;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2)}
.stat-item{flex:1;padding:28px 20px;text-align:center;border-right:1px solid var(--border)}
.stat-item:last-child{border-right:none}
.stat-num{font-size:30px;font-weight:900;letter-spacing:-1px;color:var(--g2);line-height:1}
.stat-lbl{font-size:13px;color:var(--t2);margin-top:5px;line-height:1.4}
.section{padding:80px 48px;max-width:1240px;margin:0 auto}
.sec-label{font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--g2);margin-bottom:10px}
.sec-title{font-size:clamp(26px,4vw,44px);font-weight:900;letter-spacing:-1.2px;margin-bottom:14px;line-height:1.08}
.sec-sub{font-size:16px;color:var(--t2);line-height:1.65;max-width:520px}
.full-bleed{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:80px 48px}
.full-bleed-inner{max-width:1240px;margin:0 auto}

/* DIFF GRID */
.diff-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:48px}
.diff-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:24px 26px;display:flex;gap:18px;transition:border-color .2s}
.diff-card:hover{border-color:rgba(46,160,67,.3)}
.diff-icon{width:42px;height:42px;border-radius:11px;background:rgba(46,160,67,.1);border:1px solid rgba(46,160,67,.2);display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;margin-top:2px}
.diff-title{font-size:15px;font-weight:700;margin-bottom:6px}
.diff-desc{font-size:13px;color:var(--t2);line-height:1.65}

/* WHY GRID */
.why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:48px;border:1px solid var(--border);border-radius:16px;overflow:hidden}
.why-cell{background:var(--bg2);padding:26px}
.why-icon{font-size:26px;margin-bottom:12px}
.why-title{font-size:15px;font-weight:700;margin-bottom:7px}
.why-desc{font-size:13px;color:var(--t2);line-height:1.65}
.why-result{display:inline-block;margin-top:10px;font-size:11px;font-weight:700;color:var(--g2);background:rgba(46,160,67,.08);padding:3px 9px;border-radius:6px}

/* EXAMPLE ADS */
.ex-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
.ex-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .22s;cursor:pointer}
.ex-card:hover{border-color:rgba(46,160,67,.45);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3)}
.ex-visual{height:180px;position:relative;overflow:hidden}
.ex-label{position:absolute;top:10px;left:10px;font-size:10px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:3px 9px;border-radius:5px;color:white}
.ex-offer{position:absolute;top:10px;right:10px;background:var(--gold);color:#1a1a1a;font-size:10px;font-weight:800;padding:3px 9px;border-radius:5px}
.ex-headline{position:absolute;bottom:32px;left:0;right:0;text-align:center;font-family:var(--font2);font-size:17px;font-weight:800;color:white;text-shadow:0 2px 8px rgba(0,0,0,.6);padding:0 12px;line-height:1.2}
.ex-cta-bar{position:absolute;bottom:0;left:0;right:0;background:var(--g);padding:7px;text-align:center;font-size:10px;font-weight:700;color:white;letter-spacing:.3px}
.ex-info{padding:13px 15px}
.ex-title{font-size:14px;font-weight:700;margin-bottom:3px}
.ex-desc{font-size:12px;color:var(--t2);line-height:1.5}

/* STEPS */
.steps-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:0;margin-top:48px;border:1px solid var(--border);border-radius:16px;overflow:hidden}
.step-cell{background:var(--bg2);padding:20px 12px;border-right:1px solid var(--border);text-align:center}
.step-cell:last-child{border-right:none}
.step-num{width:30px;height:30px;background:var(--g);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:white;margin:0 auto 10px}
.step-icon{font-size:18px;margin-bottom:7px}
.step-title{font-size:11px;font-weight:700;margin-bottom:3px}
.step-desc{font-size:10px;color:var(--t2);line-height:1.5}

/* PRICING */
.pricing-section{padding:90px 48px;background:var(--bg)}
.pricing-inner{max-width:860px;margin:0 auto;text-align:center}
.pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:52px;text-align:left}
.price-card{background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:32px}
.price-card.pro{border-color:rgba(46,160,67,.45);background:var(--bg3);position:relative}
.pop-tag{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--g);color:white;font-size:12px;font-weight:800;letter-spacing:1.5px;padding:5px 20px;border-radius:100px;white-space:nowrap}
.plan-type{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--t3);margin-bottom:6px}
.plan-name{font-size:22px;font-weight:800;letter-spacing:-.3px;margin-bottom:4px}
.plan-best{font-size:13px;color:var(--t2);font-style:italic;margin-bottom:20px}
.plan-pr{display:flex;align-items:baseline;gap:6px;margin-bottom:8px}
.plan-prn{font-size:54px;font-weight:900;letter-spacing:-2.5px;line-height:1}
.plan-prm{font-size:17px;font-weight:400;color:var(--t2)}
.plan-prd{font-size:13px;color:var(--t2);margin-bottom:22px;line-height:1.5}
.plan-div{border:none;border-top:1px solid var(--border);margin:0 0 18px}
.pf{display:flex;align-items:flex-start;gap:9px;font-size:13px;color:var(--t2);margin-bottom:11px;line-height:1.45}
.pf.inc{color:var(--t)}
.ck{color:var(--g2);flex-shrink:0;font-size:14px;margin-top:1px}
.cx{color:var(--t3);flex-shrink:0;font-size:14px;margin-top:1px}
.plan-btn{width:100%;margin-top:24px;padding:14px;border-radius:11px;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font);border:none;transition:all .2s}
.plan-btn-free{background:transparent;color:var(--t);border:1px solid var(--border)!important}
.plan-btn-free:hover{background:var(--bg4)}
.plan-btn-pro{background:var(--g);color:white}
.plan-btn-pro:hover{background:var(--g2);transform:translateY(-1px)}

/* CTA FINAL */
.cta-final{padding:110px 48px;text-align:center;position:relative;overflow:hidden}
.cta-final::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 70% at 50% 50%,rgba(46,160,67,.09) 0%,transparent 70%);pointer-events:none}
.cta-icon-wrap{width:68px;height:68px;background:rgba(46,160,67,.1);border:1px solid rgba(46,160,67,.2);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 28px;position:relative}
.cta-final h2{font-size:clamp(32px,5.5vw,58px);font-weight:900;letter-spacing:-2px;margin-bottom:16px;line-height:1.05;position:relative}
.cta-final p{font-size:18px;color:var(--t2);max-width:500px;margin:0 auto 40px;line-height:1.65;position:relative}
.cta-trust-row{font-size:13px;color:var(--t3);margin-top:18px;position:relative}
.cta-trust-row span{margin:0 10px}

/* ===== BUILDER PAGE ===== */
.builder-wrap{display:grid;grid-template-columns:375px 1fr;min-height:calc(100vh - 64px)}
.builder-panel{background:var(--bg2);border-right:1px solid var(--border);padding:22px;overflow-y:auto}
.builder-panel h2{font-size:18px;font-weight:800;letter-spacing:-.4px;margin-bottom:4px}
.builder-panel>p{font-size:12px;color:var(--t2);margin-bottom:14px;line-height:1.5}
.fl{display:block;font-size:11px;font-weight:700;color:var(--t2);margin-bottom:4px;letter-spacing:.5px;text-transform:uppercase}
.fg{margin-bottom:12px}
.fi{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--t);font-size:13px;font-family:var(--font);outline:none;transition:border .15s}
.fi:focus{border-color:rgba(46,160,67,.5)}
.fi::placeholder{color:var(--t3)}
select.fi option{background:var(--bg2)}
textarea.fi{resize:vertical;min-height:52px;line-height:1.5}
.sdiv{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--t3);padding:10px 0 6px;border-top:1px solid var(--border);margin-top:4px}
.tmpl-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:12px}
.tc{border:2px solid var(--border);border-radius:9px;padding:8px 4px;cursor:pointer;transition:all .15s;text-align:center;background:var(--bg)}
.tc:hover{border-color:rgba(46,160,67,.4)}
.tc.sel{border-color:var(--g);background:rgba(46,160,67,.08)}
.tt{width:100%;aspect-ratio:1;border-radius:5px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;font-size:15px;background:var(--bg3)}
.tlbl{font-size:9px;font-weight:700;color:var(--t2);line-height:1.3}
.tc.sel .tlbl{color:var(--g2)}
.layout-row{display:flex;gap:7px;margin-bottom:12px}
.lo{flex:1;padding:7px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--t2);font-size:11px;font-weight:600;cursor:pointer;text-align:center;transition:all .15s;font-family:var(--font)}
.lo.active{border-color:var(--g);background:rgba(46,160,67,.08);color:var(--g2)}
.upload-box{border:2px dashed var(--border);border-radius:10px;padding:14px;text-align:center;cursor:pointer;transition:all .15s;background:var(--bg);margin-bottom:7px;position:relative}
.upload-box:hover{border-color:rgba(46,160,67,.4);background:rgba(46,160,67,.03)}
.upload-box input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-box p{font-size:11px;color:var(--t2);margin-top:4px}
.uic{font-size:18px}
.uprev{width:100%;height:62px;object-fit:cover;border-radius:7px;margin-bottom:5px;display:none}
.abtn{width:100%;padding:11px;background:var(--g);color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font);transition:all .2s;margin-top:5px;display:flex;align-items:center;justify-content:center;gap:6px}
.abtn:hover{background:var(--g2)}
.abtn:disabled{opacity:.4;cursor:not-allowed}
.abtn.sec{background:var(--bg3);border:1px solid var(--border);color:var(--t);margin-top:5px}
.abtn.sec:hover{background:var(--bg4);border-color:var(--t3)}
.abtn.gold{background:#b45309;color:white;margin-top:5px}
.abtn.gold:hover{background:#92400e}
.abtn.blue{background:#1d4ed8;color:white;margin-top:5px}
.abtn.blue:hover{background:#1e40af}

/* CANVAS AREA */
.canvas-area{background:var(--bg3);display:flex;flex-direction:column;align-items:center;padding:24px;overflow-y:auto;gap:0}
.canvas-toolbar{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:640px;flex-wrap:wrap;gap:10px;margin-bottom:14px}
.canvas-toolbar h3{font-size:13px;font-weight:600;color:var(--t2)}
.tbns{display:flex;gap:6px;flex-wrap:wrap}
.tbtn{background:var(--bg2);border:1px solid var(--border);color:var(--t2);font-size:12px;font-weight:600;padding:7px 13px;border-radius:8px;cursor:pointer;font-family:var(--font);transition:all .15s;display:flex;align-items:center;gap:5px}
.tbtn:hover{border-color:var(--g2);color:var(--g2)}
.tbtn.dl{background:var(--g);border-color:var(--g);color:white}
.tbtn.dl:hover{background:var(--g2)}
#adCanvas{border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);max-width:100%}
.canvas-empty{text-align:center;padding:60px 32px;color:var(--t3);max-width:400px}
.canvas-empty-icon{font-size:48px;margin-bottom:16px;opacity:.35}
.canvas-empty p{font-size:14px;line-height:1.65}

/* SIDE PANELS */
.side-panel{width:100%;max-width:640px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:none;margin-top:12px}
.side-panel.show{display:block}
.sp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.sp-head h3{font-size:14px;font-weight:700}
.sp-text{font-size:13px;color:var(--t);line-height:1.78;white-space:pre-wrap}
.sp-actions{display:flex;gap:7px;margin-top:11px;flex-wrap:wrap}
.sp-btn{background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:12px;font-weight:600;padding:7px 12px;border-radius:7px;cursor:pointer;font-family:var(--font);transition:all .15s}
.sp-btn:hover{border-color:var(--g2);color:var(--g2)}
.sp-btn.copy{background:rgba(46,160,67,.1);border-color:rgba(46,160,67,.3);color:var(--g2)}
.cap-tabs{display:flex;gap:6px;margin-bottom:12px}
.cap-tab{background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:12px;font-weight:600;padding:6px 12px;border-radius:7px;cursor:pointer;font-family:var(--font);transition:all .15s}
.cap-tab.active{background:var(--g);border-color:var(--g);color:white}
.cap-content{display:none}
.cap-content.show{display:block}

/* AD SCORE */
.score-box{width:100%;max-width:640px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px 18px;display:none;margin-top:12px}
.score-box.show{display:block}
.score-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
.score-title{font-size:13px;font-weight:700}
.score-num{font-size:22px;font-weight:900;color:var(--g2)}
.score-track{height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:11px}
.score-fill{height:100%;background:linear-gradient(90deg,var(--g),var(--g3));border-radius:3px;transition:width .6s ease}
.score-tips{display:flex;flex-direction:column;gap:5px}
.score-tip{font-size:12px;color:var(--t2);display:flex;align-items:center;gap:6px}
.score-tip::before{content:'→';color:var(--g2);font-weight:700;flex-shrink:0}

/* VARIATIONS */
.var-panel{width:100%;max-width:640px;display:none;margin-top:12px}
.var-panel.show{display:block}
.var-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.var-header h3{font-size:14px;font-weight:700}
.var-grid{display:flex;flex-direction:column;gap:7px}
.var-card{background:var(--bg2);border:2px solid var(--border);border-radius:11px;padding:13px 15px;cursor:pointer;transition:all .15s}
.var-card:hover{border-color:rgba(46,160,67,.4)}
.var-card.av{border-color:var(--g);background:rgba(46,160,67,.06)}
.var-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
.var-angle{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--g2)}
.var-num{font-size:11px;color:var(--t3)}
.var-headline{font-size:13px;font-weight:700;margin-bottom:3px}
.var-offer{font-size:12px;font-weight:700;color:var(--gold);margin-bottom:2px}
.var-sub{font-size:12px;color:var(--t2)}

/* TARGETING GRID */
.tg-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px}
.tg-card{background:var(--bg3);border-radius:9px;padding:11px}
.tg-lbl{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--t3);margin-bottom:4px}
.tg-val{font-size:13px;color:var(--t);line-height:1.55}
.tg-note{font-size:12px;color:var(--t2);line-height:1.55;padding-top:8px;border-top:1px solid var(--border)}

/* CONTENT PLAN */
.c30-week{margin-bottom:14px}
.c30-week-title{font-size:13px;font-weight:700;color:var(--g2);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--border)}
.c30-post{background:var(--bg3);border-radius:8px;padding:10px 12px;margin-bottom:6px}
.c30-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.c30-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px}
.c30-plat{background:rgba(59,130,246,.12);color:#93c5fd}
.c30-type{background:rgba(46,160,67,.1);color:var(--g3)}
.c30-goal{background:rgba(234,179,8,.1);color:#fde047}
.c30-concept{font-size:12px;color:var(--t);margin-bottom:3px}
.c30-cta{font-size:11px;color:var(--t2)}

/* OFFERS PANEL */
.offers-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.offer-item{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:11px;cursor:pointer;transition:all .15s}
.offer-item:hover{border-color:var(--g);background:rgba(46,160,67,.06)}
.offer-text{font-size:13px;font-weight:700;color:var(--t);margin-bottom:3px}
.offer-type{font-size:11px;font-weight:600;color:var(--g2);margin-bottom:3px}
.offer-why{font-size:11px;color:var(--t2)}

/* HASHTAGS PANEL */
.hashtag-cloud{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.hashtag{background:var(--bg3);border:1px solid var(--border);color:var(--g3);font-size:12px;font-weight:600;padding:4px 10px;border-radius:6px;cursor:pointer;transition:all .15s}
.hashtag:hover{background:rgba(46,160,67,.1);border-color:var(--g)}
.hashtag-section-title{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--t3);margin:10px 0 6px}

/* SEASONAL PANEL */
.season-tabs{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.season-tab{background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:12px;font-weight:600;padding:6px 14px;border-radius:8px;cursor:pointer;font-family:var(--font);transition:all .15s}
.season-tab.active{background:var(--g);border-color:var(--g);color:white}
.season-content{display:none}
.season-content.show{display:block}
.season-idea{background:var(--bg3);border-radius:9px;padding:12px;margin-bottom:7px}
.season-idea-title{font-size:13px;font-weight:700;margin-bottom:4px}
.season-idea-desc{font-size:12px;color:var(--t2);margin-bottom:4px}
.season-idea-offer{font-size:12px;font-weight:600;color:var(--gold)}

/* LEAD CALCULATOR */
.calc-wrap{background:var(--bg3);border-radius:12px;padding:18px;margin-top:10px}
.calc-row{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.calc-label{font-size:13px;color:var(--t2);min-width:110px}
.calc-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:8px 12px;color:var(--t);font-size:13px;font-family:var(--font);outline:none}
.calc-input:focus{border-color:rgba(46,160,67,.5)}
.calc-results{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px}
.calc-result-item{background:var(--bg2);border:1px solid var(--border);border-radius:9px;padding:12px;text-align:center}
.calc-result-num{font-size:22px;font-weight:900;color:var(--g2);line-height:1}
.calc-result-lbl{font-size:11px;color:var(--t2);margin-top:4px}

/* REVIEW AD PANEL */
.review-input-section{margin-bottom:12px}

/* ENHANCE TOAST */
.enhance-toast{position:fixed;top:80px;right:24px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:13px 17px;font-size:13px;font-weight:600;z-index:999;opacity:0;transform:translateY(-8px);transition:all .25s;pointer-events:none;display:flex;align-items:center;gap:10px}
.enhance-toast.show{opacity:1;transform:none}

/* SPINNER */
.spin{display:inline-flex;gap:5px}
.sp{width:8px;height:8px;border-radius:50%;background:var(--g);animation:sp .7s ease-in-out infinite}
.sp:nth-child(2){animation-delay:.15s}.sp:nth-child(3){animation-delay:.3s}
@keyframes sp{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

/* TEXT ADS PAGE */
.textads-wrap{display:grid;grid-template-columns:360px 1fr;height:calc(100vh - 64px)}
.textads-form{background:var(--bg2);border-right:1px solid var(--border);padding:22px;overflow-y:auto}
.textads-form h2{font-size:18px;font-weight:800;letter-spacing:-.4px;margin-bottom:4px}
.textads-form>p{font-size:12px;color:var(--t2);margin-bottom:14px;line-height:1.5}
.plat-row{display:flex;gap:6px;flex-wrap:wrap}
.plat-pill{display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--t2);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;font-family:var(--font)}
.plat-pill.on{border-color:rgba(46,160,67,.5);background:rgba(46,160,67,.08);color:var(--g3)}
.usage-bar{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
.usage-text{font-size:12px;color:var(--t2)}
.upg-link{font-size:12px;color:var(--g2);font-weight:700;cursor:pointer;background:none;border:none;font-family:var(--font)}
.textads-output{background:var(--bg);padding:22px;overflow-y:auto}
.out-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;flex-wrap:wrap;gap:10px}
.out-header h2{font-size:18px;font-weight:800;letter-spacing:-.4px}
.tabs{display:flex;gap:5px;flex-wrap:wrap}
.tab-btn{background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:12px;font-weight:500;padding:6px 12px;border-radius:7px;cursor:pointer;font-family:var(--font);transition:all .15s}
.tab-btn.active{background:var(--g);border-color:var(--g);color:white}
.tab-content{display:none}.tab-content.active{display:block}
.ad-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:11px}
.ad-card-head{padding:10px 14px;border-bottom:1px solid var(--b2);display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600}
.ad-card-body{padding:14px}
.ad-text{font-size:13px;color:var(--t);line-height:1.75;white-space:pre-wrap}
.ad-actions{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.ad-btn{background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:11px;font-weight:600;padding:5px 9px;border-radius:7px;cursor:pointer;font-family:var(--font);transition:all .15s}
.ad-btn:hover{border-color:var(--g2);color:var(--g2)}
.ad-btn.copy{background:rgba(46,160,67,.1);border-color:rgba(46,160,67,.3);color:var(--g2)}
.as-row{margin-top:9px;padding:9px 11px;background:var(--bg3);border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:5px}
.as-lbl{font-size:11px;color:var(--t3);font-weight:500}
.as-dots{display:flex;gap:3px}
.as-dot{width:6px;height:6px;border-radius:50%;background:var(--border)}
.as-dot.on{background:var(--g2)}
.as-val{font-size:11px;font-weight:700}
.empty-out{text-align:center;padding:60px 24px;color:var(--t3)}
.loading-state{text-align:center;padding:50px 24px}
.loading-state p{color:var(--t2);font-size:13px;margin-top:11px}

/* IDEAS */
.ideas-wrap{max-width:940px;margin:0 auto;padding:36px}
.ideas-wrap h2{font-size:26px;font-weight:800;letter-spacing:-.5px;margin-bottom:6px}
.ideas-wrap>p{font-size:14px;color:var(--t2);margin-bottom:24px;line-height:1.5}
.ideas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:11px;margin-bottom:20px}
.idea-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:all .15s}
.idea-card:hover{border-color:rgba(46,160,67,.35);transform:translateY(-1px)}
.itag{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;display:inline-block;padding:2px 7px;border-radius:5px}
.ti{background:rgba(131,58,180,.15);color:#c084fc}
.tf{background:rgba(59,130,246,.12);color:#93c5fd}
.tt{background:rgba(239,68,68,.1);color:#fca5a5}
.tg{background:rgba(34,197,94,.1);color:var(--g3)}
.ts{background:rgba(234,179,8,.1);color:#fde047}
.idea-card h3{font-size:13px;font-weight:700;margin-bottom:4px}
.idea-card p{font-size:12px;color:var(--t2);line-height:1.5}
.idea-result{background:var(--bg2);border:1px solid rgba(46,160,67,.3);border-radius:12px;padding:18px;display:none}
.idea-result.show{display:block}
.ir-title{font-size:13px;font-weight:700;color:var(--g2);margin-bottom:8px}
.ir-content{font-size:13px;color:var(--t);line-height:1.75;white-space:pre-wrap;margin-bottom:8px}
.ir-tips{display:flex;flex-direction:column;gap:4px}
.ir-tip{font-size:12px;color:var(--t2);display:flex;align-items:center;gap:6px}
.ir-tip::before{content:'💡';flex-shrink:0}

/* COACH */
.coach-wrap{display:flex;flex-direction:column;height:calc(100vh - 64px)}
.coach-msgs{flex:1;overflow-y:auto;padding:22px 34px}
.coach-inner{max-width:700px;margin:0 auto}
.cmsg{margin-bottom:14px}.cmsg.user{text-align:right}
.mb{display:inline-block;padding:11px 15px;border-radius:12px;font-size:13px;line-height:1.65;max-width:540px;text-align:left}
.cmsg.user .mb{background:var(--g);color:white;border-radius:12px 12px 3px 12px}
.cmsg.ai .mb{background:var(--bg2);border:1px solid var(--border);border-radius:12px 12px 12px 3px}
.mrole{font-size:11px;color:var(--t3);font-weight:600;margin-bottom:4px}
.coach-bottom{border-top:1px solid var(--border);padding:15px 34px;background:var(--bg2)}
.coach-bottom-inner{max-width:700px;margin:0 auto}
.suggs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px}
.sugg{background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:12px;padding:5px 11px;border-radius:8px;cursor:pointer;font-family:var(--font);transition:all .15s}
.sugg:hover{border-color:rgba(46,160,67,.4);color:var(--g2)}
.coach-row{display:flex;gap:8px}
.coach-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:10px 13px;color:var(--t);font-size:13px;font-family:var(--font);outline:none}
.coach-input:focus{border-color:rgba(46,160,67,.4)}
.coach-input::placeholder{color:var(--t3)}
.coach-send{background:var(--g);color:white;border:none;border-radius:10px;padding:0 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font);transition:all .15s}
.coach-send:hover{background:var(--g2)}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;background:var(--bg3);border:1px solid var(--border);color:var(--t);padding:11px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;opacity:0;transform:translateY(8px);transition:all .25s;pointer-events:none}
.toast.show{opacity:1;transform:none}

/* ERROR STATE */
.error-msg{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:#fca5a5;margin-top:8px;display:none}
.error-msg.show{display:block}
/* CHECKLIST */
.chk-item{display:flex;align-items:flex-start;gap:10px;padding:9px 12px;background:var(--bg3);border-radius:8px;cursor:pointer;transition:all .15s;border:1px solid transparent}
.chk-item:hover{border-color:rgba(46,160,67,.2)}
.chk-item.done{background:rgba(46,160,67,.07);border-color:rgba(46,160,67,.2)}
.chk-box{width:18px;height:18px;border-radius:5px;border:2px solid var(--border);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .15s}
.chk-item.done .chk-box{background:var(--g);border-color:var(--g);color:white}
.chk-label{font-size:13px;color:var(--t2);line-height:1.4}
.chk-item.done .chk-label{color:var(--t);text-decoration:line-through;text-decoration-color:rgba(46,160,67,.4)}
/* COMP CARD */
.comp-card{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:13px}
.comp-angle{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--g2);margin-bottom:4px}
.comp-headline{font-size:13px;font-weight:700;color:var(--t);margin-bottom:3px}
.comp-offer{font-size:12px;color:var(--gold);margin-bottom:4px}
.comp-diff{font-size:12px;color:var(--t2);line-height:1.5}
/* LEAD MAGNET CARD */
.lm-card{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:13px;cursor:pointer;transition:all .15s}
.lm-card:hover{border-color:var(--g);background:rgba(46,160,67,.06)}
.lm-name{font-size:13px;font-weight:700;color:var(--g2);margin-bottom:3px}
.lm-headline{font-size:12px;font-weight:600;color:var(--t);margin-bottom:4px}
.lm-desc{font-size:12px;color:var(--t2);margin-bottom:4px;line-height:1.5}
.lm-cta{font-size:11px;font-weight:700;color:var(--g2);background:rgba(46,160,67,.1);padding:3px 9px;border-radius:5px;display:inline-block}
.lm-format{font-size:11px;color:var(--t3);margin-top:4px}

@media(max-width:960px){
  .builder-wrap,.textads-wrap{grid-template-columns:1fr}
  .why-grid,.diff-grid,.ex-gallery,.pricing-grid{grid-template-columns:1fr}
  .steps-grid{grid-template-columns:repeat(2,1fr)}
  nav{padding:0 16px}.nav-btn{display:none}
  .hero,.section,.full-bleed,.pricing-section,.cta-final{padding-left:20px;padding-right:20px}
}
</style>
</head>
<body>

<nav>
  <div class="logo" onclick="show('landing')">
    <div class="logo-icon">🌿</div>
    <span class="logo-text">LandscapeAdsAI</span>
  </div>
  <div class="nav-links">
    <button class="nav-btn" id="nav-builder" onclick="show('builder')">🎨 Ad Creator</button>
    <button class="nav-btn" id="nav-textads" onclick="show('textads')">✍️ Copy Generator</button>
    <button class="nav-btn" id="nav-tools" onclick="show('tools')">🛠 Tools</button>
    <button class="nav-btn" id="nav-ideas" onclick="show('ideas')">💡 Ideas</button>
    <button class="nav-btn" id="nav-coach" onclick="show('coach')">📈 Growth Coach</button>
    <button class="nav-btn" onclick="show('landing');setTimeout(()=>document.getElementById('pricing').scrollIntoView({behavior:'smooth'}),50)">Pricing</button>
    <span id="planBadge" class="plan-free" onclick="openModal()">FREE — Upgrade</span>
    <button class="nav-cta" onclick="show('builder')">Start Creating →</button>
  </div>
</nav>

<!-- UPGRADE MODAL -->
<div class="overlay" id="upgradeModal">
  <div class="modal">
    <button class="modal-x" onclick="closeModal()">✕</button>
    <h2>Upgrade to Pro 🌿</h2>
    <p>Unlimited ads, no watermarks, 5 variations, 30-day content calendar, and every tool — for less than a tank of gas per month.</p>
    <div class="modal-feats">
      <div class="modal-feat"><span class="mfck">✓</span> Unlimited visual ad generations</div>
      <div class="modal-feat"><span class="mfck">✓</span> No watermark on any download</div>
      <div class="modal-feat"><span class="mfck">✓</span> Generate 5 ad variations per session</div>
      <div class="modal-feat"><span class="mfck">✓</span> Social caption for FB, Instagram & TikTok</div>
      <div class="modal-feat"><span class="mfck">✓</span> 30-day content calendar</div>
      <div class="modal-feat"><span class="mfck">✓</span> High-converting offer generator</div>
      <div class="modal-feat"><span class="mfck">✓</span> Hashtag generator + seasonal ideas</div>
      <div class="modal-feat"><span class="mfck">✓</span> Lead estimate calculator</div>
      <div class="modal-feat"><span class="mfck">✓</span> Growth Coach — unlimited access</div>
    </div>
    <button class="stripe-btn" id="stripeBtn" onclick="startCheckout()">
      <span id="stripeBtnLabel">Subscribe — $19/month</span>
    </button>
    <p class="stripe-note">Secure payment via Stripe · Cancel anytime · No contracts</p>
    <div class="dev-note" id="devNote">
      <strong>⚙️ Stripe not yet configured.</strong> Add to Vercel environment variables:<br>
      <code>STRIPE_SECRET_KEY</code> &nbsp;·&nbsp; <code>STRIPE_PUBLISHABLE_KEY</code> &nbsp;·&nbsp; <code>STRIPE_PRICE_ID</code><br><br>
      Until configured, clicking Subscribe will show this message. Once keys are added, it opens a real Stripe Checkout.
    </div>
  </div>
</div>

<div class="enhance-toast" id="enhToast">
  <div class="spin"><div class="sp"></div><div class="sp"></div><div class="sp"></div></div>
  <span id="enhMsg">Enhancing photo...</span>
</div>

<!-- ======= LANDING ======= -->
<div class="page active" id="page-landing">
  <div class="hero">
    <div class="hero-eyebrow"><span class="eyedot"></span> Purpose-built for landscaping businesses</div>
    <h1>Turn Your Lawn Photos<br>Into <em>Ads That Get You Calls</em></h1>
    <p class="hero-sub">Upload a photo, pick a template, and get a <strong>platform-ready visual ad</strong> — with your offer, your branding, and your CTA — in under 60 seconds.</p>
    <p class="hero-proof">No marketing experience. No agency. No monthly contract.</p>
    <div class="hero-btns">
      <button class="btn-hero" onclick="show('builder')">Create 3 Free Ads →</button>
      <button class="btn-ghost" onclick="show('tools')">Explore Tools</button>
    </div>
    <p class="hero-trust"><span>No credit card</span>·<span>3 free visual ads</span>·<span>Download as PNG</span></p>
  </div>

  <div class="stats-row">
    <div class="stat-item"><div class="stat-num">60s</div><div class="stat-lbl">Photo to finished ad</div></div>
    <div class="stat-item"><div class="stat-num">5</div><div class="stat-lbl">Ad variations per session</div></div>
    <div class="stat-item"><div class="stat-num">5</div><div class="stat-lbl">Ad templates included</div></div>
    <div class="stat-item"><div class="stat-num">30</div><div class="stat-lbl">Days of content, one click</div></div>
  </div>

  <!-- WHY NOT CHATGPT -->
  <div class="section">
    <div class="sec-label">Why Not Just Use ChatGPT?</div>
    <div class="sec-title">ChatGPT gives you text.<br>We give you finished ads.</div>
    <div class="diff-grid">
      <div class="diff-card"><div class="diff-icon">🖼️</div><div><div class="diff-title">Platform-ready visual creative, not just text</div><div class="diff-desc">We produce an actual downloadable PNG — your photo, your offer badge, your headline, your CTA — all placed professionally. ChatGPT gives you words in a text box.</div></div></div>
      <div class="diff-card"><div class="diff-icon">🏷️</div><div><div class="diff-title">Offer badge auto-placed on every ad</div><div class="diff-desc">Enter "20% off first cut" and it automatically renders as a gold badge on the image. ChatGPT has no idea what your ad is supposed to look like.</div></div></div>
      <div class="diff-card"><div class="diff-icon">🔀</div><div><div class="diff-title">5 structured ad angles for split testing</div><div class="diff-desc">Urgency, Transformation, Trust, Offer, and Local Authority — 5 different angles generated at once. That's a real marketing workflow, not a single answer.</div></div></div>
      <div class="diff-card"><div class="diff-icon">✨</div><div><div class="diff-title">Photo enhancement built for lawn photos</div><div class="diff-desc">One click brightens your grass, boosts greens, and sharpens edges. ChatGPT cannot touch your photos.</div></div></div>
      <div class="diff-card"><div class="diff-icon">🎯</div><div><div class="diff-title">Local targeting recommendations included</div><div class="diff-desc">After generating your ad, get exact targeting settings — location, age, interests, budget, and best times to run. A complete campaign launch, not just copy.</div></div></div>
      <div class="diff-card"><div class="diff-icon">🧮</div><div><div class="diff-title">Lead estimate calculator</div><div class="diff-desc">Enter your ad budget and see estimated reach, leads, jobs, and potential revenue. ChatGPT cannot calculate your ROI based on your actual spend.</div></div></div>
    </div>
  </div>

  <!-- WHY LANDSCAPERS -->
  <div class="full-bleed">
    <div class="full-bleed-inner">
      <div class="sec-label">Why Landscapers Use LandscapeAdsAI</div>
      <div class="sec-title">Built for landscapers.<br>Not generic businesses.</div>
      <div class="why-grid">
        <div class="why-cell"><div class="why-icon">📸</div><div class="why-title">Ready-to-Post Visual Ads</div><div class="why-desc">Upload a lawn photo and get a finished visual ad — not just text to paste. Your photo, your offer badge, your CTA. Done in under 60 seconds.</div><span class="why-result">↑ Post across social media instantly</span></div>
        <div class="why-cell"><div class="why-icon">⚡</div><div class="why-title">5 Variations Instantly</div><div class="why-desc">Get 5 different ad angles at once — pick the one that fits and test what converts in your market.</div><span class="why-result">↑ Real split-testing workflow</span></div>
        <div class="why-cell"><div class="why-icon">📅</div><div class="why-title">30-Day Content Calendar</div><div class="why-desc">One click generates a full month of structured social content organized by week, platform, and goal.</div><span class="why-result">↑ Never run out of content ideas</span></div>
        <div class="why-cell"><div class="why-icon">🌿</div><div class="why-title">Seasonal Marketing Ideas</div><div class="why-desc">Spring, summer, fall, winter — get specific marketing ideas and offers tailored to each season of the landscaping year.</div><span class="why-result">↑ Right message at the right time</span></div>
        <div class="why-cell"><div class="why-icon">💰</div><div class="why-title">High-Converting Offer Generator</div><div class="why-desc">Get 6 proven offer ideas specific to your service — discounts, bundles, free add-ons, referral programs, and seasonal deals.</div><span class="why-result">↑ Stop guessing what offer to run</span></div>
        <div class="why-cell"><div class="why-icon">🚫</div><div class="why-title">No Design Skills Required</div><div class="why-desc">No Canva. No Photoshop. No designer. Fill in info, upload a photo, click generate. Your ad is done in under 2 minutes.</div><span class="why-result">↑ Generate ads in under 30 seconds</span></div>
      </div>
    </div>
  </div>

  <!-- EXAMPLE ADS -->
  <div class="section">
    <div class="sec-label">Ad Gallery</div>
    <div class="sec-title">What gets generated</div>
    <div class="sec-sub">Premium ad layouts built specifically for landscaping businesses.</div>
    <div class="ex-gallery">
      <div class="ex-card">
        <div class="ex-visual" style="background:linear-gradient(160deg,#0a1a0a,#1a3a1a)">
          <div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr">
            <div style="background:rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:3px solid rgba(255,255,255,.8)"><span style="background:#ef4444;color:white;font-size:10px;font-weight:800;padding:3px 10px;border-radius:5px">BEFORE</span></div>
            <div style="background:rgba(46,160,67,.15);display:flex;flex-direction:column;align-items:center;justify-content:center"><span style="background:#2ea043;color:white;font-size:10px;font-weight:800;padding:3px 10px;border-radius:5px">AFTER</span></div>
          </div>
          <div class="ex-headline" style="bottom:34px">LAWN TRANSFORMATION</div>
          <div class="ex-cta-bar">CALL FOR FREE ESTIMATE</div>
        </div>
        <div class="ex-info"><div class="ex-title">Before / After Split</div><div class="ex-desc">Best social proof. Visual transformations build trust instantly.</div></div>
      </div>
      <div class="ex-card">
        <div class="ex-visual" style="background:linear-gradient(160deg,#0a1608,#1a3a12)">
          <span class="ex-label" style="background:#2ea043">⚡ SPOTS OPEN</span>
          <span class="ex-offer">20% OFF FIRST CUT</span>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;padding-top:40px">
            <div style="font-size:10px;font-weight:700;color:var(--g2);letter-spacing:1px;margin-bottom:6px">GREEN VALLEY LANDSCAPING</div>
            <div style="font-family:var(--font2);font-size:20px;font-weight:800;color:white;text-align:center;margin-bottom:7px">WEEKLY LAWN MOWING</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:center"><span style="font-size:9px;font-weight:700;background:rgba(255,255,255,.12);color:rgba(255,255,255,.8);padding:2px 6px;border-radius:4px">Licensed</span><span style="font-size:9px;font-weight:700;background:rgba(255,255,255,.12);color:rgba(255,255,255,.8);padding:2px 6px;border-radius:4px">Insured</span><span style="font-size:9px;font-weight:700;background:rgba(255,255,255,.12);color:rgba(255,255,255,.8);padding:2px 6px;border-radius:4px">Free Quote</span></div>
          </div>
          <div class="ex-cta-bar">CALL NOW — LIMITED SPOTS</div>
        </div>
        <div class="ex-info"><div class="ex-title">Spots Open — Urgency Ad</div><div class="ex-desc">Urgency + offer badge drives immediate calls from new customers.</div></div>
      </div>
      <div class="ex-card">
        <div class="ex-visual" style="background:linear-gradient(160deg,#0d1f0a,#1a3d10)">
          <span class="ex-label" style="background:#15803d">🌱 SPRING SPECIAL</span>
          <span class="ex-offer">20% OFF</span>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;padding-top:36px">
            <div style="font-family:var(--font2);font-size:22px;font-weight:800;color:white;text-align:center;margin-bottom:6px">SPRING CLEANUP<br>SEASON IS HERE</div>
            <div style="font-size:10px;color:rgba(255,255,255,.6)">New customer offer · Limited seasonal spots</div>
          </div>
          <div class="ex-cta-bar">BOOK YOUR SPRING SLOT TODAY</div>
        </div>
        <div class="ex-info"><div class="ex-title">Spring Offer Promo</div><div class="ex-desc">Seasonal urgency fills your schedule fast with a clear discount.</div></div>
      </div>
      <div class="ex-card">
        <div class="ex-visual" style="background:linear-gradient(160deg,#0a0e1a,#141e33)">
          <span class="ex-label" style="background:#1d4ed8">⭐ 5-STAR REVIEW</span>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;padding-top:36px">
            <div style="font-size:13px;color:rgba(255,255,255,.8);text-align:center;font-style:italic;line-height:1.5;margin-bottom:8px">"Best lawn service in the area. Showed up on time, yard looked amazing."</div>
            <div style="font-size:11px;font-weight:700;color:var(--gold)">★★★★★ — Happy Customer</div>
            <div style="margin-top:6px;font-size:10px;color:rgba(255,255,255,.4)">Green Valley Landscaping · Local Service Area</div>
          </div>
          <div class="ex-cta-bar" style="background:#1d4ed8">JOIN HUNDREDS OF HAPPY CUSTOMERS</div>
        </div>
        <div class="ex-info"><div class="ex-title">Testimonial / Review Ad</div><div class="ex-desc">Social proof converts skeptics. Reviews build trust before they call.</div></div>
      </div>
      <div class="ex-card">
        <div class="ex-visual" style="background:linear-gradient(160deg,#0d1a0a,#1a3515)">
          <span class="ex-offer">FREE ESTIMATE</span>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;padding-top:24px">
            <div style="font-size:10px;font-weight:700;color:var(--g2);letter-spacing:1px;margin-bottom:5px">FULL PROPERTY SERVICES</div>
            <div style="font-family:var(--font2);font-size:18px;font-weight:800;color:white;text-align:center;margin-bottom:8px">WE DO IT ALL</div>
            <div style="display:flex;flex-direction:column;gap:3px;align-items:center"><div style="font-size:10px;color:rgba(255,255,255,.75)">✓ Mowing &nbsp; ✓ Edging &nbsp; ✓ Cleanup</div><div style="font-size:10px;color:rgba(255,255,255,.75)">✓ Mulching &nbsp; ✓ Leaf Removal</div></div>
          </div>
          <div class="ex-cta-bar">ONE CALL HANDLES EVERYTHING</div>
        </div>
        <div class="ex-info"><div class="ex-title">Multi-Service Promo</div><div class="ex-desc">Show customers you handle everything — one relationship, full property care.</div></div>
      </div>
      <div class="ex-card">
        <div class="ex-visual" style="background:linear-gradient(160deg,#1a0f05,#3d2010)">
          <span class="ex-label" style="background:#b45309">🍂 FALL SPECIAL</span>
          <span class="ex-offer">SAVE $50</span>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;padding-top:36px">
            <div style="font-family:var(--font2);font-size:20px;font-weight:800;color:white;text-align:center;margin-bottom:5px">MULCHING &<br>LEAF REMOVAL</div>
            <div style="font-size:10px;color:rgba(255,255,255,.6)">Same-week service · Satisfaction guaranteed</div>
          </div>
          <div class="ex-cta-bar" style="background:#b45309">CALL FOR FREE QUOTE</div>
        </div>
        <div class="ex-info"><div class="ex-title">Fall Mulching Service</div><div class="ex-desc">Dollar-amount offers often outperform percentage discounts — feels more concrete.</div></div>
      </div>
    </div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="full-bleed">
    <div class="full-bleed-inner">
      <div class="sec-label">How It Works</div>
      <div class="sec-title">7 steps from photo to running campaign</div>
      <div class="steps-grid">
        <div class="step-cell"><div class="step-num">1</div><div class="step-icon">✏️</div><div class="step-title">Enter Info</div><div class="step-desc">Name, city, service, offer</div></div>
        <div class="step-cell"><div class="step-num">2</div><div class="step-icon">📷</div><div class="step-title">Upload Photo</div><div class="step-desc">Enhance in one click</div></div>
        <div class="step-cell"><div class="step-num">3</div><div class="step-icon">🤖</div><div class="step-title">Generate Ad</div><div class="step-desc">AI writes & places copy</div></div>
        <div class="step-cell"><div class="step-num">4</div><div class="step-icon">🔀</div><div class="step-title">Pick Variation</div><div class="step-desc">Choose from 5 angles</div></div>
        <div class="step-cell"><div class="step-num">5</div><div class="step-icon">⬇️</div><div class="step-title">Download PNG</div><div class="step-desc">High-quality image</div></div>
        <div class="step-cell"><div class="step-num">6</div><div class="step-icon">📝</div><div class="step-title">Get Caption</div><div class="step-desc">Platform-ready post text</div></div>
        <div class="step-cell"><div class="step-num">7</div><div class="step-icon">🎯</div><div class="step-title">Launch Guide</div><div class="step-desc">Targeting & budget tips</div></div>
      </div>
    </div>
  </div>

  <!-- PRICING -->
  <div id="pricing" class="pricing-section">
    <div class="pricing-inner">
      <div class="sec-label" style="display:block;text-align:center">Pricing</div>
      <div class="sec-title">Simple pricing. No surprises.</div>
      <p style="color:var(--t2);font-size:15px;margin-top:10px">Use 3 free ads. See real results. Then decide.</p>
      <div class="pricing-grid">
        <div class="price-card">
          <div class="plan-type">Free Plan</div><div class="plan-name">Get Started</div><div class="plan-best">Best for trying it out</div>
          <div class="plan-pr"><span class="plan-prn">$0</span><span class="plan-prm">/forever</span></div>
          <div class="plan-prd">3 ads. No credit card. See what's possible.</div>
          <hr class="plan-div">
          <div class="pf inc"><span class="ck">✓</span> 3 visual ad generations</div>
          <div class="pf inc"><span class="ck">✓</span> All 5 ad templates</div>
          <div class="pf inc"><span class="ck">✓</span> AI-written copy with offer badge</div>
          <div class="pf inc"><span class="ck">✓</span> Download as PNG</div>
          <div class="pf"><span class="cx">✗</span> Watermark on every download</div>
          <div class="pf"><span class="cx">✗</span> 5 ad variations per session</div>
          <div class="pf"><span class="cx">✗</span> Social caption generator</div>
          <div class="pf"><span class="cx">✗</span> 30-day content calendar</div>
          <div class="pf"><span class="cx">✗</span> Offer generator + hashtags</div>
          <div class="pf"><span class="cx">✗</span> Lead estimate calculator</div>
          <div class="pf"><span class="cx">✗</span> Growth Coach access</div>
          <button class="plan-btn plan-btn-free" onclick="show('builder')" style="border:1px solid var(--border)">Create 3 Free Ads</button>
        </div>
        <div class="price-card pro">
          <div class="pop-tag">MOST POPULAR</div>
          <div class="plan-type">Pro Plan</div><div class="plan-name">Grow Faster</div><div class="plan-best">Best for landscapers posting every week</div>
          <div class="plan-pr"><span class="plan-prn" style="color:var(--g2)">$19</span><span class="plan-prm">/month</span></div>
          <div class="plan-prd">Unlimited ads. No watermark. Every feature.</div>
          <hr class="plan-div">
          <div class="pf inc"><span class="ck">✓</span> <strong>Unlimited</strong> visual ad generations</div>
          <div class="pf inc"><span class="ck">✓</span> <strong>No watermark</strong> on any download</div>
          <div class="pf inc"><span class="ck">✓</span> <strong>5 ad variations</strong> — all 5 angles</div>
          <div class="pf inc"><span class="ck">✓</span> Social caption for FB, Instagram & TikTok</div>
          <div class="pf inc"><span class="ck">✓</span> Photo enhancement</div>
          <div class="pf inc"><span class="ck">✓</span> 30-day content calendar</div>
          <div class="pf inc"><span class="ck">✓</span> High-converting offer generator</div>
          <div class="pf inc"><span class="ck">✓</span> Hashtag generator</div>
          <div class="pf inc"><span class="ck">✓</span> Seasonal marketing ideas</div>
          <div class="pf inc"><span class="ck">✓</span> Lead estimate calculator</div>
          <div class="pf inc"><span class="ck">✓</span> Campaign setup guide</div>
          <div class="pf inc"><span class="ck">✓</span> Growth Coach — unlimited</div>
          <button class="plan-btn plan-btn-pro" onclick="openModal()">Subscribe — $19/month</button>
        </div>
      </div>
      <p style="font-size:13px;color:var(--t3);margin-top:18px;text-align:center">$19/month is less than one hour of agency time. Cancel anytime via Stripe.</p>
    </div>
  </div>

  <div class="cta-final">
    <div class="cta-icon-wrap">🚀</div>
    <h2>Your next customer<br>is one ad away.</h2>
    <p>Upload a lawn photo right now. Your first 3 ads are free — no credit card, no setup.</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative">
      <button class="btn-hero" onclick="show('builder')" style="font-size:17px;padding:17px 42px">Turn Photos Into Ads →</button>
      <button class="btn-ghost" onclick="show('tools')" style="font-size:15px;padding:17px 28px">Explore All Tools</button>
    </div>
    <p class="cta-trust-row"><span>No credit card</span>·<span>3 free ads</span>·<span>Cancel anytime</span></p>
  </div>
</div><!-- /landing -->

<!-- ======= BUILDER ======= -->
<div class="page" id="page-builder">
  <div class="builder-wrap">
    <div class="builder-panel">
      <h2>🎨 Visual Ad Creator</h2>
      <p>Fill in info → upload photo → generate → pick variation → download → get caption.</p>
      <div class="wm-banner" id="wmBanner">
        <p>Free plan: downloads include a <strong>watermark</strong>. <strong>Pro</strong> removes it.</p>
        <button onclick="openModal()">Upgrade — $19/mo</button>
      </div>

      <div class="sdiv">① Business Info</div>
      <div class="fg"><label class="fl">Business Name</label><input class="fi" id="bBiz" placeholder="e.g. Green Valley Landscaping"></div>
      <div class="fg"><label class="fl">City / Location</label><input class="fi" id="bCity" placeholder="e.g. Austin, Texas"></div>
      <div class="fg"><label class="fl">Service</label>
        <select class="fi" id="bService">
          <option value="">Select service...</option>
          <option>Lawn Mowing</option><option>Landscaping Design</option><option>Yard Cleanup</option>
          <option>Tree Trimming</option><option>Leaf Removal</option><option>Sod Installation</option>
          <option>Mulching</option><option>Snow Removal</option><option>Full Property Maintenance</option>
        </select>
      </div>
      <div class="fg"><label class="fl">Special Offer <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--t3)">(renders as gold badge on ad)</span></label><input class="fi" id="bOffer" placeholder="e.g. 20% off first cut"></div>
      <div class="fg"><label class="fl">Phone / CTA Line</label><input class="fi" id="bPhone" placeholder="e.g. Call (555) 000-1234"></div>

      <div class="sdiv">② Template</div>
      <div class="tmpl-grid">
        <div class="tc sel" data-t="beforeafter" onclick="selTmpl(this)"><div class="tt">⬛⬜</div><div class="tlbl">Before/After</div></div>
        <div class="tc" data-t="spotsopen" onclick="selTmpl(this)"><div class="tt">⚡</div><div class="tlbl">Spots Open</div></div>
        <div class="tc" data-t="springoffer" onclick="selTmpl(this)"><div class="tt">🌱</div><div class="tlbl">Spring Offer</div></div>
        <div class="tc" data-t="testimonial" onclick="selTmpl(this)"><div class="tt">⭐</div><div class="tlbl">Testimonial</div></div>
        <div class="tc" data-t="multiservice" onclick="selTmpl(this)"><div class="tt">📋</div><div class="tlbl">Multi-Service</div></div>
      </div>

      <div class="sdiv">③ Layout</div>
      <div class="layout-row">
        <div class="lo active" data-l="square" onclick="selLayout(this)">⬜ Square 1080×1080</div>
        <div class="lo" data-l="portrait" onclick="selLayout(this)">📱 Portrait 1080×1350</div>
      </div>

      <div class="sdiv">④ Upload Photos</div>
      <div id="up1Wrap">
        <label class="fl" id="up1Label">Photo 1 (Before)</label>
        <div class="upload-box"><input type="file" accept="image/*" id="upload1" onchange="handleUpload(1,this)"><div class="uic">📷</div><p>Click or drag photo here</p></div>
        <img id="preview1" class="uprev">
      </div>
      <div id="up2Wrap">
        <label class="fl" id="up2Label">Photo 2 (After)</label>
        <div class="upload-box"><input type="file" accept="image/*" id="upload2" onchange="handleUpload(2,this)"><div class="uic">📷</div><p>Click or drag photo here</p></div>
        <img id="preview2" class="uprev">
      </div>
      <button class="abtn gold" id="enhBtn" onclick="enhancePhoto()" style="display:none">✨ Enhance Photo</button>

      <div class="sdiv">⑤ Ad Text (AI-generated — editable)</div>
      <div class="fg"><label class="fl">Headline</label><input class="fi" id="bHeadline" placeholder="Click Generate to auto-fill..."></div>
      <div class="fg"><label class="fl">Supporting Text</label><textarea class="fi" id="bSubtext" placeholder="Click Generate to auto-fill..." rows="2"></textarea></div>
      <div class="fg"><label class="fl">CTA Button Text</label><input class="fi" id="bCta" placeholder="Click Generate to auto-fill..."></div>
      <div id="ctaOptionsWrap" style="display:none;margin-top:-8px;margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:var(--t3);letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">Quick-pick a CTA:</div>
        <div id="ctaOptionsList" style="display:flex;flex-wrap:wrap;gap:5px;"></div>
      </div>
      <div class="error-msg" id="buildError"></div>

      <button class="abtn" id="buildBtn" onclick="genAndRender()">✨ Generate Ad + Preview</button>
      <button class="abtn sec" id="varBtn" onclick="genVariations()" style="display:none">🔀 Generate 5 Ad Variations</button>
      <button class="abtn sec" id="captBtn" onclick="genCaption()" style="display:none">📝 Generate Social Caption</button>
      <button class="abtn sec" id="tgBtn" onclick="showTargeting()" style="display:none">🎯 Campaign Setup Guide</button>
      <button class="abtn sec" id="c30Btn" onclick="genContent30()" style="display:none">📅 Generate 30-Day Content Plan</button>
      <button class="abtn sec" id="rrBtn" onclick="renderCanvas()" style="display:none">🔄 Re-render with My Edits</button>
    </div>

    <div class="canvas-area" id="canvasArea">
      <div class="canvas-toolbar">
        <h3 id="canvasLabel">Preview will appear here</h3>
        <div class="tbns">
          <button class="tbtn" onclick="renderCanvas()" id="rrBtn2" style="display:none">🔄 Refresh</button>
          <button class="tbtn dl" onclick="dlAd()" id="dlBtn" style="display:none">⬇ Download PNG</button>
        </div>
      </div>
      <div class="canvas-empty" id="canvasEmpty">
        <div class="canvas-empty-icon">🖼️</div>
        <p>Fill in your business info, upload a photo, and click <strong style="color:var(--t2)">"Generate Ad + Preview"</strong> to see your finished ad here.</p>
      </div>
      <canvas id="adCanvas" style="display:none"></canvas>

      <!-- AD SCORE -->
      <div class="score-box" id="scoreBox">
        <div class="score-header"><div class="score-title">📊 Ad Quality Score</div><div class="score-num" id="scoreNum">—</div></div>
        <div class="score-track"><div class="score-fill" id="scoreFill" style="width:0%"></div></div>
        <div class="score-tips" id="scoreTips"></div>
      </div>

      <!-- 5 VARIATIONS -->
      <div class="var-panel" id="varPanel">
        <div class="var-header"><h3>🔀 5 Variations — Click to Apply</h3><span style="font-size:11px;color:var(--t3)">Each uses a different conversion angle</span></div>
        <div class="var-grid" id="varGrid"></div>
        <div class="error-msg" id="varError"></div>
      </div>

      <!-- SOCIAL CAPTION (with tabs) -->
      <div class="side-panel" id="captionPanel">
        <div class="sp-head"><h3>📝 Social Caption</h3><span style="font-size:11px;color:var(--t3)">Ready for Facebook, Instagram & TikTok</span></div>
        <div class="cap-tabs">
          <button class="cap-tab active" onclick="showCapTab(this,'capFb')">Facebook</button>
          <button class="cap-tab" onclick="showCapTab(this,'capIg')">Instagram</button>
          <button class="cap-tab" onclick="showCapTab(this,'capTt')">TikTok</button>
        </div>
        <div class="cap-content show" id="capFb"><div class="sp-text" id="capFbText"></div></div>
        <div class="cap-content" id="capIg"><div class="sp-text" id="capIgText"></div></div>
        <div class="cap-content" id="capTt"><div class="sp-text" id="capTtText"></div></div>
        <div class="sp-actions">
          <button class="sp-btn copy" onclick="copyActiveCaption()">📋 Copy Caption</button>
          <button class="sp-btn" onclick="document.getElementById('captionPanel').classList.remove('show')">Close</button>
        </div>
        <div class="error-msg" id="captError"></div>
      </div>

      <!-- CAMPAIGN SETUP -->
      <div class="side-panel" id="targetPanel">
        <div class="sp-head"><h3>🎯 Campaign Setup Guide</h3><span style="font-size:11px;color:var(--t3)">Recommended ad settings</span></div>
        <div class="tg-grid">
          <div class="tg-card"><div class="tg-lbl">Location</div><div class="tg-val" id="tgLoc">Homeowners within 10 miles of your city</div></div>
          <div class="tg-card"><div class="tg-lbl">Age Range</div><div class="tg-val">30–65 years old</div></div>
          <div class="tg-card"><div class="tg-lbl">Interests</div><div class="tg-val">Home improvement · Gardening · Landscaping · DIY · Homeowners</div></div>
          <div class="tg-card"><div class="tg-lbl">Daily Budget</div><div class="tg-val">$5–$10/day · Run 5–7 days to start</div></div>
          <div class="tg-card"><div class="tg-lbl">Campaign Goal</div><div class="tg-val">Messages or Lead Form — not website clicks</div></div>
          <div class="tg-card"><div class="tg-lbl">Best Times</div><div class="tg-val">Thu–Sun · 7–9am and 5–8pm local time</div></div>
        </div>
        <div class="tg-note">💡 <strong>Pro tip:</strong> Start at $5/day. If you get messages in the first 48 hours, increase to $10. If no response after 3 days, switch to a different ad variation.</div>
        <div class="sp-actions"><button class="sp-btn" onclick="document.getElementById('targetPanel').classList.remove('show')">Close</button></div>
      </div>

      <!-- 30-DAY CONTENT PLAN -->
      <div class="side-panel" id="contentPanel">
        <div class="sp-head"><h3>📅 30-Day Content Plan</h3><button class="sp-btn copy" onclick="copyEl('contentBody')">📋 Copy All</button></div>
        <div id="contentBody"></div>
        <div class="error-msg" id="c30Error"></div>
      </div>

    </div>
  </div>
</div>

<!-- ======= TOOLS PAGE ======= -->
<div class="page" id="page-tools">
  <div style="max-width:960px;margin:0 auto;padding:36px">
    <h2 style="font-size:26px;font-weight:800;letter-spacing:-.5px;margin-bottom:6px">🛠 Marketing Tools</h2>
    <p style="font-size:14px;color:var(--t2);margin-bottom:28px;line-height:1.5">Specialized tools that help you get more leads from your landscaping business.</p>

    <!-- BUSINESS INFO for tools -->
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:var(--t3);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px">Your Business Info (used by all tools below)</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        <div><label class="fl">Business Name</label><input class="fi" id="tBiz" placeholder="e.g. Green Valley Landscaping"></div>
        <div><label class="fl">City</label><input class="fi" id="tCity" placeholder="e.g. Austin, Texas"></div>
        <div><label class="fl">Service</label>
          <select class="fi" id="tService">
            <option value="">Select...</option>
            <option>Lawn Mowing</option><option>Landscaping Design</option><option>Yard Cleanup</option>
            <option>Tree Trimming</option><option>Leaf Removal</option><option>Sod Installation</option>
            <option>Mulching</option><option>Snow Removal</option><option>Full Property Maintenance</option>
          </select>
        </div>
      </div>
    </div>

    <!-- TOOLS GRID -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">

      <!-- OFFER GENERATOR -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">💰 High-Converting Offer Generator</div>
        <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Get 6 proven offer ideas for your specific service — discounts, bundles, referrals, and seasonal deals.</div>
        <button class="abtn" id="offersBtn" onclick="genOffers()">Generate Offers</button>
        <div class="error-msg" id="offersError"></div>
        <div class="offers-grid" id="offersGrid" style="margin-top:12px"></div>
      </div>

      <!-- HASHTAG GENERATOR -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">📲 Hashtag Generator</div>
        <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Generate targeted hashtags for Instagram and TikTok — mixing niche, local, and trending tags.</div>
        <button class="abtn" id="hashBtn" onclick="genHashtags()">Generate Hashtags</button>
        <div class="error-msg" id="hashError"></div>
        <div id="hashResult" style="margin-top:12px;display:none">
          <div class="hashtag-section-title">Instagram</div>
          <div class="hashtag-cloud" id="igHashtags"></div>
          <div class="hashtag-section-title" style="margin-top:10px">TikTok</div>
          <div class="hashtag-cloud" id="ttHashtags"></div>
          <div style="font-size:12px;color:var(--t2);margin-top:10px;line-height:1.5" id="hashTips"></div>
          <div class="sp-actions" style="margin-top:10px">
            <button class="sp-btn copy" onclick="copyHashtags()">📋 Copy Instagram Tags</button>
          </div>
        </div>
      </div>

      <!-- BEFORE/AFTER CAPTION -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">🔀 Before/After Caption Generator</div>
        <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Generate the perfect caption for your before/after transformation posts.</div>
        <div class="fg"><label class="fl">Offer to highlight</label><input class="fi" id="baOffer" placeholder="e.g. 20% off first cut"></div>
        <button class="abtn" id="baBtn" onclick="genBeforeAfter()">Generate Caption</button>
        <div class="error-msg" id="baError"></div>
        <div id="baResult" style="display:none;margin-top:12px">
          <div style="font-size:13px;color:var(--t);line-height:1.75;white-space:pre-wrap;background:var(--bg3);border-radius:8px;padding:12px" id="baCaption"></div>
          <div style="font-size:12px;color:var(--g3);margin-top:6px;line-height:1.6" id="baHashtags"></div>
          <div class="sp-actions" style="margin-top:8px">
            <button class="sp-btn copy" onclick="copyEl('baCaption')">📋 Copy Caption</button>
          </div>
        </div>
      </div>

      <!-- SEASONAL IDEAS -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">🌿 Seasonal Marketing Ideas</div>
        <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Get specific marketing ideas for each season of the landscaping year.</div>
        <button class="abtn" id="seasonBtn" onclick="genSeasonal()">Generate Seasonal Ideas</button>
        <div class="error-msg" id="seasonError"></div>
        <div id="seasonResult" style="display:none;margin-top:12px">
          <div class="season-tabs">
            <button class="season-tab active" onclick="showSeason(this,'sp')">🌱 Spring</button>
            <button class="season-tab" onclick="showSeason(this,'su')">☀️ Summer</button>
            <button class="season-tab" onclick="showSeason(this,'fa')">🍂 Fall</button>
            <button class="season-tab" onclick="showSeason(this,'wi')">❄️ Winter</button>
          </div>
          <div class="season-content show" id="sp"></div>
          <div class="season-content" id="su"></div>
          <div class="season-content" id="fa"></div>
          <div class="season-content" id="wi"></div>
        </div>
      </div>

      <!-- LEAD CALCULATOR -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">🧮 Lead Estimate Calculator</div>
        <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Enter your ad budget and see estimated reach, leads, jobs, and potential revenue.</div>
        <div class="calc-wrap">
          <div class="calc-row">
            <span class="calc-label">Daily budget</span>
            <input type="number" class="calc-input" id="calcBudget" value="5" min="1" max="500" oninput="calcLeads()">
            <span style="font-size:13px;color:var(--t2)">/day</span>
          </div>
          <div class="calc-row">
            <span class="calc-label">Run for</span>
            <input type="number" class="calc-input" id="calcDays" value="7" min="1" max="30" oninput="calcLeads()">
            <span style="font-size:13px;color:var(--t2)">days</span>
          </div>
          <div class="calc-row">
            <span class="calc-label">Avg job value</span>
            <span style="font-size:13px;color:var(--t2)">$</span>
            <input type="number" class="calc-input" id="calcJobValue" value="150" min="1" oninput="calcLeads()">
          </div>
          <div class="calc-results" id="calcResults">
            <div class="calc-result-item"><div class="calc-result-num" id="calcSpend">$35</div><div class="calc-result-lbl">Total Spend</div></div>
            <div class="calc-result-item"><div class="calc-result-num" id="calcReach">5,250</div><div class="calc-result-lbl">Est. Reach</div></div>
            <div class="calc-result-item"><div class="calc-result-num" id="calcLeadsNum">5–14</div><div class="calc-result-lbl">Est. Leads</div></div>
            <div class="calc-result-item"><div class="calc-result-num" id="calcRevenue">$375–750</div><div class="calc-result-lbl">Est. Revenue</div></div>
          </div>
          <div style="font-size:11px;color:var(--t3);margin-top:10px;line-height:1.5">Estimates based on typical local landscaping ad performance. Results vary by market, ad quality, and offer strength.</div>
        </div>
      </div>

      <!-- REVIEW AD GENERATOR -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">⭐ Review / Testimonial Ad</div>
        <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Turn a customer review into a professional testimonial ad with headline, copy, and CTA.</div>
        <div class="fg"><label class="fl">Customer Review Text</label><textarea class="fi" id="reviewText" placeholder="e.g. Best lawn service we've used. Very professional and on time!" rows="2"></textarea></div>
        <div class="fg"><label class="fl">Customer Name (optional)</label><input class="fi" id="reviewerName" placeholder="e.g. Sarah M."></div>
        <button class="abtn" id="reviewBtn" onclick="genReviewAd()">Generate Testimonial Ad</button>
        <div class="error-msg" id="reviewError"></div>
        <div id="reviewResult" style="display:none;margin-top:12px;background:var(--bg3);border-radius:9px;padding:14px">
          <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:4px">★★★★★ Quote</div>
          <div style="font-size:13px;color:var(--t);font-style:italic;margin-bottom:10px" id="rQuote"></div>
          <div style="font-size:11px;font-weight:700;color:var(--t3);margin-bottom:3px">HEADLINE</div>
          <div style="font-size:14px;font-weight:700;color:var(--t);margin-bottom:8px" id="rHeadline"></div>
          <div style="font-size:12px;color:var(--t2);margin-bottom:8px" id="rSupporting"></div>
          <div style="font-size:12px;font-weight:600;color:var(--g2);margin-bottom:10px" id="rTrust"></div>
          <div class="sp-actions">
            <button class="sp-btn copy" onclick="copyReviewAd()">📋 Copy Ad</button>
          </div>
        </div>
      </div>

      <!-- 3 more tools: Checklist, Competitor Ideas, Lead Magnet -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px">

        <!-- MARKETING CHECKLIST -->
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">✅ Marketing Checklist</div>
          <div style="font-size:13px;color:var(--t2);margin-bottom:16px;line-height:1.5">Track the basics that consistently grow landscaping businesses. Check off as you go.</div>
          <div style="display:flex;flex-direction:column;gap:9px" id="checklistItems"></div>
          <div style="margin-top:12px;padding:9px 12px;background:var(--bg3);border-radius:8px;font-size:12px;color:var(--t2);line-height:1.6" id="checklistProgress"></div>
        </div>

        <!-- COMPETITOR AD IDEAS -->
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">🥊 Competitor Ad Ideas</div>
          <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">See 4 strategic ad angles you can use to stand out in your local market — based on your service and city.</div>
          <button class="abtn" id="compBtn" onclick="genCompetitor()">Generate Competitor Ideas</button>
          <div class="error-msg" id="compError"></div>
          <div id="compResult" style="margin-top:12px;display:none;flex-direction:column;gap:9px"></div>
        </div>

        <!-- LEAD MAGNET GENERATOR -->
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px">
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">🧲 Lead Magnet Generator</div>
          <div style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5">Get 5 free-offer ideas that turn ad clicks into real leads — visits, guides, consultations, and more.</div>
          <button class="abtn" id="lmBtn" onclick="genLeadMagnets()">Generate Lead Magnets</button>
          <div class="error-msg" id="lmError"></div>
          <div id="lmResult" style="margin-top:12px;display:none;flex-direction:column;gap:9px"></div>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- ======= COPY GENERATOR ======= -->
<div class="page" id="page-textads">
  <div class="textads-wrap">
    <div class="textads-form">
      <h2>✍️ Copy Generator</h2>
      <p>Platform-specific ad copy for Facebook, Instagram, Google & TikTok.</p>
      <div class="fg"><label class="fl">Business Name</label><input class="fi" id="gBiz" placeholder="e.g. Green Valley Landscaping"></div>
      <div class="fg"><label class="fl">City / Location</label><input class="fi" id="gCity" placeholder="e.g. Austin, Texas"></div>
      <div class="fg"><label class="fl">Service Type</label>
        <select class="fi" id="gService">
          <option value="">Select a service...</option>
          <option>Lawn Mowing</option><option>Landscaping Design</option><option>Yard Cleanup</option>
          <option>Tree Trimming</option><option>Leaf Removal</option><option>Irrigation / Sprinklers</option>
          <option>Sod Installation</option><option>Mulching</option><option>Snow Removal</option><option>Full Property Maintenance</option>
        </select>
      </div>
      <div class="fg"><label class="fl">Special Offer <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--t3)">(optional)</span></label><input class="fi" id="gOffer" placeholder="e.g. 20% off first mow"></div>
      <div class="fg"><label class="fl">Target Customer</label>
        <select class="fi" id="gTarget">
          <option value="">Select...</option><option>Homeowners</option><option>Commercial Properties</option>
          <option>HOA Communities</option><option>Rental Property Managers</option><option>New Homeowners</option>
        </select>
      </div>
      <div class="fg"><label class="fl">Tone</label>
        <select class="fi" id="gTone">
          <option>Professional & Trustworthy</option><option>Friendly & Local</option>
          <option>Bold & Direct</option><option>Affordable & Value-Focused</option>
        </select>
      </div>
      <div class="fg"><label class="fl">Platforms</label>
        <div class="plat-row">
          <div class="plat-pill on" data-p="facebook" onclick="this.classList.toggle('on')">📘 Facebook</div>
          <div class="plat-pill on" data-p="instagram" onclick="this.classList.toggle('on')">📸 Instagram</div>
          <div class="plat-pill on" data-p="google" onclick="this.classList.toggle('on')">🔍 Google</div>
          <div class="plat-pill on" data-p="tiktok" onclick="this.classList.toggle('on')">🎵 TikTok</div>
        </div>
      </div>
      <div class="usage-bar">
        <span class="usage-text">📊 Free: <strong id="usageCt">0</strong> of 3 used</span>
        <button class="upg-link" onclick="openModal()">Upgrade →</button>
      </div>
      <button class="abtn" id="genBtn" onclick="runGenerate()">✨ Generate Ad Copy</button>
      <div class="error-msg" id="genError"></div>
      <div style="margin-top:10px;padding:10px 12px;background:var(--bg3);border-radius:8px;font-size:12px;color:var(--t3);line-height:1.5">
        💡 <strong style="color:var(--t2)">Want visual ads too?</strong> Use the <span onclick="show('builder')" style="color:var(--g2);cursor:pointer;font-weight:600">🎨 Ad Creator</span> to place this copy on a real image.
      </div>
    </div>
    <div class="textads-output">
      <div class="out-header">
        <h2>Generated Copy</h2>
        <div class="tabs" id="tabRow" style="display:none">
          <button class="tab-btn active" onclick="switchTab(this,'fb')">Facebook</button>
          <button class="tab-btn" onclick="switchTab(this,'ig')">Instagram</button>
          <button class="tab-btn" onclick="switchTab(this,'gg')">Google</button>
          <button class="tab-btn" onclick="switchTab(this,'tt')">TikTok</button>
        </div>
      </div>
      <div id="emptyState" class="empty-out"><div style="font-size:34px;margin-bottom:10px;opacity:.35">📋</div><p style="font-size:14px;font-weight:600;color:var(--t2);margin-bottom:5px">Your ad copy will appear here</p><p style="font-size:13px">Fill in details and click Generate.</p></div>
      <div id="loadState" style="display:none" class="loading-state"><div class="spin"><div class="sp"></div><div class="sp"></div><div class="sp"></div></div><p>Writing your copy...</p></div>
      <div id="tab-fb" class="tab-content active" style="display:none"></div>
      <div id="tab-ig" class="tab-content" style="display:none"></div>
      <div id="tab-gg" class="tab-content" style="display:none"></div>
      <div id="tab-tt" class="tab-content" style="display:none"></div>
    </div>
  </div>
</div>

<!-- ======= IDEAS ======= -->
<div class="page" id="page-ideas">
  <div class="ideas-wrap">
    <h2>💡 Content Ideas</h2>
    <p>Click any idea to instantly generate ready-to-use content.</p>
    <div class="ideas-grid" id="ideasGrid"></div>
    <div class="idea-result" id="ideaBox">
      <div class="ir-title" id="ideaTitle"></div>
      <div class="ir-content" id="ideaContent"></div>
      <div class="ir-tips" id="ideaTips"></div>
      <div style="display:flex;gap:8px;margin-top:11px">
        <button class="ad-btn copy" onclick="copyEl('ideaContent')">📋 Copy</button>
        <button class="ad-btn" onclick="document.getElementById('ideaBox').classList.remove('show')">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- ======= GROWTH COACH ======= -->
<div class="page" id="page-coach">
  <div class="coach-wrap">
    <div class="coach-msgs" id="coachMsgs">
      <div class="coach-inner">
        <div class="cmsg ai"><div class="mrole">📈 Growth Coach</div><div class="mb">Hey! I'm your landscaping growth coach. Ask me anything about getting more customers, pricing jobs, running ads on a budget, handling slow seasons, getting more reviews, or growing your referral base. What's on your mind?</div></div>
      </div>
    </div>
    <div class="coach-bottom"><div class="coach-bottom-inner">
      <div class="suggs" id="coachSuggs">
        <button class="sugg" onclick="useSugg(this)">How do I get more 5-star reviews?</button>
        <button class="sugg" onclick="useSugg(this)">What should I charge for a yard cleanup?</button>
        <button class="sugg" onclick="useSugg(this)">Best way to get clients in winter?</button>
        <button class="sugg" onclick="useSugg(this)">How often should I post on social media?</button>
      </div>
      <div class="coach-row">
        <input class="coach-input" id="coachIn" placeholder="Ask anything about growing your landscaping business..." onkeydown="if(event.key==='Enter')sendCoach()">
        <button class="coach-send" onclick="sendCoach()">Send →</button>
      </div>
    </div></div>
  </div>
</div>

<!-- ======= DEBUG PANEL ======= -->
<div id="debugPanel" style="position:fixed;bottom:0;left:0;right:0;z-index:9000;font-family:monospace;font-size:12px;background:#0a0a0a;border-top:2px solid #ff6b35;display:none">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 14px;background:#111;border-bottom:1px solid #333;cursor:pointer" onclick="dbToggleBody()">
    <span style="color:#ff6b35;font-weight:bold">🐛 DEVELOPER DEBUG PANEL <span id="dbBadge" style="background:#ff6b35;color:#000;padding:1px 7px;border-radius:3px;font-size:11px;margin-left:8px">0 events</span></span>
    <span style="display:flex;gap:10px;align-items:center">
      <button onclick="event.stopPropagation();dbClear()" style="background:#333;border:none;color:#ccc;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:11px">Clear</button>
      <button onclick="event.stopPropagation();dbCopyAll()" style="background:#333;border:none;color:#ccc;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:11px">Copy All</button>
      <button onclick="event.stopPropagation();dbClose()" style="background:#333;border:none;color:#ff6b35;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:11px">✕ Close</button>
    </span>
  </div>
  <div id="dbBody" style="max-height:340px;overflow-y:auto;padding:0">
    <div id="dbEmpty" style="padding:14px 18px;color:#555">No debug events yet. Click a button like Generate Ad or Generate Variations to see logs here.</div>
    <div id="dbLog"></div>
  </div>
</div>

<!-- DEBUG TRIGGER BUTTON (always visible in corner) -->
<button id="dbTrigger" onclick="dbOpen()" title="Open Debug Panel" style="position:fixed;bottom:14px;left:14px;z-index:8999;background:#111;border:1px solid #ff6b35;color:#ff6b35;font-family:monospace;font-size:11px;font-weight:bold;padding:5px 10px;border-radius:5px;cursor:pointer;opacity:.7">🐛 DEBUG</button>

<div class="toast" id="toastEl"></div>

<script>
// ═══════════════════════════════════════════════════════════
// LandscapeAdsAI V8 — Client Logic
// All API calls return structured JSON. No plain-text parsing.
// ═══════════════════════════════════════════════════════════

const API = '/api/generate';
const DEBUG = false; // Set to true to show the developer debug panel
let isPro = false;
let usage = 0, chatHistory = [];
let curTmpl = 'beforeafter', curLayout = 'square';
let img1 = null, img2 = null;
let curAd = {};

// ── STRIPE ────────────────────────────────────────────────
let stripeConfigured = false;
(async function initStripe() {
  try {
    const r = await fetch('/api/stripe-config', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' });
    const d = await r.json();
    stripeConfigured = d.configured === true;
    if (!stripeConfigured) document.getElementById('devNote').style.display = 'block';
  } catch(e) { document.getElementById('devNote').style.display = 'block'; }
})();

async function startCheckout() {
  if (!stripeConfigured) { toast('Stripe not yet configured — see the developer note below.'); return; }
  const btn = document.getElementById('stripeBtn');
  btn.disabled = true; document.getElementById('stripeBtnLabel').textContent = 'Redirecting to Stripe...';
  try {
    const r = await fetch('/api/create-checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ successUrl: location.origin+'?upgraded=true', cancelUrl: location.origin+'?cancelled=true' }) });
    const d = await r.json();
    if (d.url) { window.location.href = d.url; return; }
    toast('Checkout error: ' + (d.error || 'Unknown error'));
  } catch(e) { toast('Checkout failed. Please try again.'); }
  btn.disabled = false; document.getElementById('stripeBtnLabel').textContent = 'Subscribe — $19/month';
}

// Post-checkout
(function() {
  const p = new URLSearchParams(location.search);
  if (p.get('upgraded') === 'true') { activatePro(); toast('Welcome to Pro! Subscription active.'); history.replaceState({}, '', location.pathname); }
  if (p.get('cancelled') === 'true') { toast('Checkout cancelled. Upgrade anytime.'); history.replaceState({}, '', location.pathname); }
})();

function activatePro() {
  isPro = true;
  const b = document.getElementById('planBadge'), wb = document.getElementById('wmBanner');
  b.className = 'plan-pro'; b.textContent = '✓ PRO'; b.onclick = null;
  if (wb) wb.style.display = 'none';
}
function openModal() { document.getElementById('upgradeModal').classList.add('open'); }
function closeModal() { document.getElementById('upgradeModal').classList.remove('open'); }
document.getElementById('upgradeModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });

// ── UTILITIES ─────────────────────────────────────────────
function show(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('act'));
  const n = document.getElementById('nav-' + p); if (n) n.classList.add('act');
  window.scrollTo(0, 0); if (p === 'ideas') initIdeas();
}
function toast(msg) {
  const t = document.getElementById('toastEl'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
function showErr(id, msg) { const el = document.getElementById(id); if (el) { el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 6000); } }
function hideErr(id) { const el = document.getElementById(id); if (el) el.classList.remove('show'); }
function setBtn(id, loading, label) { const el = document.getElementById(id); if (!el) return; el.disabled = loading; el.innerHTML = loading ? '<div class="spin"><div class="sp"></div><div class="sp"></div><div class="sp"></div></div> ' + label : label; }
function copyEl(id) { const el = document.getElementById(id); if (el) navigator.clipboard.writeText(el.textContent || el.innerText).then(() => toast('Copied!')); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;'); }

// apiCall defined below in debug section — do not add another here

// ── WATERMARK ─────────────────────────────────────────────
function drawWM(ctx, W, H) {
  if (isPro) return;
  const bh = 44, by = H - bh;
  ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(0, by, W, bh);
  ctx.fillStyle = 'rgba(46,160,67,.9)'; ctx.fillRect(0, by, 4, bh);
  ctx.font = '500 22px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,.82)';
  ctx.fillText('🌿 Generated with LandscapeAdsAI', 32, by + bh/2 + 7);
  ctx.font = '400 19px Inter,sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.fillText('landscapeadsai.com', W - 24, by + bh/2 + 7);
}

// ── TEMPLATE / LAYOUT ─────────────────────────────────────
function selTmpl(el) {
  document.querySelectorAll('.tc').forEach(c => c.classList.remove('sel')); el.classList.add('sel'); curTmpl = el.dataset.t;
  const u2 = document.getElementById('up2Wrap'), l1 = document.getElementById('up1Label');
  if (curTmpl === 'beforeafter') { l1.textContent = 'Photo 1 (Before)'; u2.style.display = 'block'; }
  else { l1.textContent = 'Background / Main Photo'; u2.style.display = 'none'; }
}
function selLayout(el) {
  document.querySelectorAll('.lo').forEach(p => p.classList.remove('active')); el.classList.add('active'); curLayout = el.dataset.l;
}

// ── UPLOAD ────────────────────────────────────────────────
function handleUpload(num, input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      if (num === 1) img1 = img; else img2 = img;
      const pr = document.getElementById('preview' + num); pr.src = e.target.result; pr.style.display = 'block';
      if (num === 1) document.getElementById('enhBtn').style.display = 'flex';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── ENHANCE ───────────────────────────────────────────────
function enhancePhoto() {
  if (!img1) { toast('Upload a photo first'); return; }
  const et = document.getElementById('enhToast'); document.getElementById('enhMsg').textContent = 'Enhancing photo...'; et.classList.add('show');
  setTimeout(() => {
    const c = document.createElement('canvas'); c.width = img1.width; c.height = img1.height;
    const ctx = c.getContext('2d'); ctx.drawImage(img1, 0, 0);
    const id = ctx.getImageData(0, 0, c.width, c.height), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i+1], b = d[i+2];
      r = Math.min(255, r+20); g = Math.min(255, g+25); b = Math.min(255, b+14);
      if (g > r && g > b) { g = Math.min(255, g+22); r = Math.max(0, r-5); }
      r = Math.min(255, Math.max(0, ((r/255-.5)*1.18+.5)*255));
      g = Math.min(255, Math.max(0, ((g/255-.5)*1.18+.5)*255));
      b = Math.min(255, Math.max(0, ((b/255-.5)*1.18+.5)*255));
      d[i]=r; d[i+1]=g; d[i+2]=b;
    }
    ctx.putImageData(id, 0, 0);
    const ni = new Image();
    ni.onload = () => {
      img1 = ni; document.getElementById('preview1').src = c.toDataURL(); document.getElementById('preview1').style.display = 'block';
      et.classList.remove('show'); toast('Photo enhanced! ✓ Brighter, greener, sharper');
      const eb = document.getElementById('enhBtn'); eb.textContent = '✓ Photo Enhanced'; eb.style.opacity = '.55';
    };
    ni.src = c.toDataURL();
  }, 300);
}

// ── AD SCORE ──────────────────────────────────────────────
function showAdScore() {
  const biz = document.getElementById('bBiz').value.trim();
  const city = document.getElementById('bCity').value.trim();
  const offer = document.getElementById('bOffer').value.trim();
  const headline = document.getElementById('bHeadline').value.trim();
  const subtext = document.getElementById('bSubtext').value.trim();
  const cta = document.getElementById('bCta').value.trim();
  let score = 0, tips = [];
  if (biz) score += 1; if (city) score += 1.5; else tips.push('Add your city for local credibility');
  if (offer) { score += 2; } else tips.push('Add a special offer — significantly boosts response rate');
  if (headline) score += 1.5; else tips.push('A strong headline gets more attention');
  if (subtext) score += 1; if (cta) score += 1.5; else tips.push('Add clear CTA button text');
  if (img1) score += 0.5; if (/(\d+%|off|save|free|special|deal)/i.test(offer)) score += 0.5;
  if (tips.length === 0) tips.push('Looking strong! Try variations to find the best angle.');
  score = Math.min(10, parseFloat(score.toFixed(1)));
  document.getElementById('scoreNum').textContent = score + '/10';
  document.getElementById('scoreFill').style.width = (score * 10) + '%';
  const col = score >= 8 ? 'var(--g2)' : score >= 6 ? '#fde047' : score >= 4 ? '#fb923c' : '#f87171';
  document.getElementById('scoreNum').style.color = col;
  document.getElementById('scoreTips').innerHTML = tips.map(t => `<div class="score-tip">${t}</div>`).join('');
  document.getElementById('scoreBox').classList.add('show');
}

// ── FALLBACK CTA LIST (used if AI doesn't return ctaOptions) ──
const FALLBACK_CTAS = [
  'Get Your Free Estimate',
  'Book Your First Cut Today',
  'Claim 20% Off Now',
  'DM "CUT" for a Free Estimate',
  "Text 'CUT' for Pricing",
  'Reserve Your Lawn Service',
  'Book Before Spots Fill'
];

function renderCtaOptions(options) {
  const wrap = document.getElementById('ctaOptionsWrap');
  const list = document.getElementById('ctaOptionsList');
  if (!wrap || !list) return;
  const opts = (Array.isArray(options) && options.length > 0) ? options : FALLBACK_CTAS.slice(0, 3);
  list.innerHTML = '';
  opts.forEach(opt => {
    const pill = document.createElement('button');
    pill.textContent = opt;
    pill.style.cssText = 'background:var(--bg3);border:1px solid var(--border);color:var(--t2);font-size:11px;font-weight:600;padding:4px 10px;border-radius:7px;cursor:pointer;font-family:var(--font);transition:all .15s;white-space:nowrap;';
    pill.onmouseover = () => { pill.style.borderColor='var(--g)'; pill.style.color='var(--g2)'; };
    pill.onmouseout  = () => { pill.style.borderColor='var(--border)'; pill.style.color='var(--t2)'; };
    pill.onclick = () => {
      document.getElementById('bCta').value = opt;
      // Update curAd and re-render canvas immediately
      curAd = { ...curAd, cta: opt };
      renderCanvas();
    };
    list.appendChild(pill);
  });
  wrap.style.display = 'block';
}

// ── GENERATE AD + RENDER ──────────────────────────────────
async function genAndRender() {
  const biz     = document.getElementById('bBiz').value.trim();
  const city    = document.getElementById('bCity').value.trim();
  const service = document.getElementById('bService').value;
  const offer   = document.getElementById('bOffer').value.trim() || 'Free Estimate';
  const phone   = document.getElementById('bPhone').value.trim() || 'Call for a free estimate';
  if (!biz || !city || !service) { showErr('buildError', 'Please fill in Business Name, City, and Service before generating.'); return; }
  hideErr('buildError');
  setBtn('buildBtn', true, 'Generating...');

  // Read current field values — user may have already typed something
  const existingHeadline = document.getElementById('bHeadline').value.trim();
  const existingSubtext  = document.getElementById('bSubtext').value.trim();
  const existingCta      = document.getElementById('bCta').value.trim();

  try {
    const d = await apiCall({ type:'visual', biz, city, service, offer, phone, template: curTmpl, _button: 'Generate Ad + Preview' });

    // Auto-fill: only overwrite fields the user left blank
    const headline       = existingHeadline || d.headline       || `Professional ${service}`;
    const supportingText = existingSubtext  || d.supportingText || 'Licensed & Insured • Free Estimates';
    const ctaText        = existingCta      || d.ctaText        || d.cta || FALLBACK_CTAS[0];

    document.getElementById('bHeadline').value = headline;
    document.getElementById('bSubtext').value  = supportingText;
    document.getElementById('bCta').value      = ctaText;

    // Show CTA quick-pick options
    renderCtaOptions(d.ctaOptions || FALLBACK_CTAS.slice(0, 3));

    curAd = {
      biz, city, service, offer, phone,
      headline, supportingText,
      cta:         ctaText,
      offerBadge:  d.offerBadge  || offer.toUpperCase(),
      trustLine:   d.trustLine   || 'Licensed & Insured • Free Estimates • Locally Trusted',
      detailLine1: d.detailLine1 || 'Same-Week Service Available',
      detailLine2: d.detailLine2 || 'Satisfaction Guaranteed',
      urgencyLine: d.urgencyLine || 'Limited spots available this week',
      cityLine:    d.cityLine    || city.toUpperCase()
    };
  } catch(e) {
    showErr('buildError', 'Generation failed: ' + e.message + '. You can type your own text and click Re-render.');
    // Fallback: fill only empty fields, render anyway
    const fallbackHeadline = existingHeadline || `Professional ${service}`;
    const fallbackSubtext  = existingSubtext  || 'Licensed & Insured • Free Estimates';
    const fallbackCta      = existingCta      || FALLBACK_CTAS[0];
    document.getElementById('bHeadline').value = fallbackHeadline;
    document.getElementById('bSubtext').value  = fallbackSubtext;
    document.getElementById('bCta').value      = fallbackCta;
    renderCtaOptions(FALLBACK_CTAS.slice(0, 3));
    curAd = {
      biz, city, service, offer, phone,
      headline: fallbackHeadline, supportingText: fallbackSubtext, cta: fallbackCta,
      offerBadge:  offer.toUpperCase(),
      trustLine:   'Licensed & Insured • Free Estimates',
      detailLine1: 'Same-Week Service Available',
      detailLine2: 'Satisfaction Guaranteed',
      urgencyLine: 'Limited spots available',
      cityLine:    city.toUpperCase()
    };
  }
  setBtn('buildBtn', false, '✨ Generate Ad + Preview');
  ['varBtn','captBtn','tgBtn','c30Btn','rrBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'flex'; });
  document.getElementById('tgLoc').textContent = `Homeowners within 10 miles of ${city}`;
  renderCanvas();
  showAdScore();
}

// ── GENERATE 5 VARIATIONS ─────────────────────────────────
async function genVariations() {
  const biz = document.getElementById('bBiz').value.trim();
  const city = document.getElementById('bCity').value.trim();
  const service = document.getElementById('bService').value;
  const offer = document.getElementById('bOffer').value.trim() || 'Free Estimate';
  const phone = document.getElementById('bPhone').value.trim() || 'Call for a free estimate';
  if (!biz || !city) { showErr('varError', 'Fill in Business Name and City first.'); return; }
  hideErr('varError');
  setBtn('varBtn', true, 'Generating 5 variations...');
  try {
    const d = await apiCall({ type:'variations', biz, city, service, offer, phone, _button: 'Generate 5 Ad Variations' });
    if (!d.variations || d.variations.length === 0) throw new Error('No variations returned. Please try again.');
    renderVarPanel(d.variations);
  } catch(e) {
    showErr('varError', 'Variations failed: ' + e.message);
  }
  setBtn('varBtn', false, '🔀 Generate 5 Ad Variations');
}
function renderVarPanel(vars) {
  const panel = document.getElementById('varPanel'), grid = document.getElementById('varGrid');
  grid.innerHTML = '';
  vars.forEach((v, i) => {
    const card = document.createElement('div'); card.className = 'var-card' + (i === 0 ? ' av' : '');
    // ctaText is canonical; cta is legacy fallback
    const ctaVal = v.ctaText || v.cta || '';
    card.innerHTML = `<div class="var-top"><span class="var-angle">${esc(v.angle || 'Variation '+(i+1))}</span><span class="var-num">Variation ${v.id || i+1}</span></div><div class="var-headline">${esc(v.headline||'')}</div><div class="var-offer">🏷 ${esc(v.offerBadge||'')}</div><div class="var-sub">${esc(v.supportingText||'')}${v.detailLine ? ' · '+esc(v.detailLine) : ''}</div>`;
    card.onclick = () => {
      document.querySelectorAll('.var-card').forEach(c => c.classList.remove('av')); card.classList.add('av');
      document.getElementById('bHeadline').value = v.headline || '';
      document.getElementById('bSubtext').value  = v.supportingText || '';
      document.getElementById('bCta').value      = ctaVal;
      curAd = {
        ...curAd,
        headline:     v.headline,
        supportingText:v.supportingText,
        cta:          ctaVal,
        offerBadge:   v.offerBadge || curAd.offerBadge,
        trustLine:    v.trustLine  || curAd.trustLine,
        detailLine1:  v.detailLine || curAd.detailLine1
      };
      renderCanvas();
      toast('Variation ' + (v.id||i+1) + ' — ' + esc(v.angle||'') + ' applied!');
    };
    grid.appendChild(card);
  });
  panel.classList.add('show');
  // Auto-apply first variation
  if (vars[0]) {
    const v0 = vars[0];
    const ctaVal0 = v0.ctaText || v0.cta || '';
    document.getElementById('bHeadline').value = v0.headline || '';
    document.getElementById('bSubtext').value  = v0.supportingText || '';
    document.getElementById('bCta').value      = ctaVal0;
    curAd = {
      ...curAd,
      headline:      v0.headline,
      supportingText:v0.supportingText,
      cta:           ctaVal0,
      offerBadge:    v0.offerBadge || curAd.offerBadge,
      trustLine:     v0.trustLine  || curAd.trustLine
    };
    renderCanvas();
  }
}

// ── SOCIAL CAPTION ────────────────────────────────────────
async function genCaption() {
  const biz = document.getElementById('bBiz').value.trim() || 'our business';
  const city = document.getElementById('bCity').value.trim() || 'our area';
  const service = document.getElementById('bService').value || 'lawn care';
  const offer = document.getElementById('bOffer').value.trim() || 'Free Estimate';
  const phone = document.getElementById('bPhone').value.trim() || 'Call us today';
  hideErr('captError');
  setBtn('captBtn', true, 'Writing captions...');
  try {
    const d = await apiCall({ type:'caption', biz, city, service, offer, phone, _button: 'Generate Social Caption' });
    // API returns either { captions: { facebook, instagram, tiktok } } or flat { facebook, instagram, tiktok }
    const caps = d.captions || d;
    const fb = caps.facebook || d.facebook || '';
    const ig = caps.instagram || d.instagram || '';
    const tt = caps.tiktok || d.tiktok || '';
    if (!fb && !ig && !tt) throw new Error('No caption content returned.');
    document.getElementById('capFbText').textContent = fb;
    document.getElementById('capIgText').textContent = ig;
    document.getElementById('capTtText').textContent = tt;
    document.getElementById('captionPanel').classList.add('show');
    // Reset to Facebook tab
    document.querySelectorAll('.cap-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.cap-content').forEach(c => c.classList.remove('show'));
    document.querySelectorAll('.cap-tab')[0].classList.add('active');
    document.getElementById('capFb').classList.add('show');
  } catch(e) { showErr('captError', 'Caption failed: ' + e.message); }
  setBtn('captBtn', false, '📝 Generate Social Caption');
}
function showCapTab(btn, id) {
  document.querySelectorAll('.cap-tab').forEach(t => t.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.cap-content').forEach(c => c.classList.remove('show')); document.getElementById(id).classList.add('show');
}
function copyActiveCaption() {
  const active = document.querySelector('.cap-content.show .sp-text');
  if (active) navigator.clipboard.writeText(active.textContent).then(() => toast('Caption copied!'));
}

// ── 30-DAY CONTENT PLAN ───────────────────────────────────
async function genContent30() {
  const biz = document.getElementById('bBiz').value.trim() || '';
  const city = document.getElementById('bCity').value.trim() || '';
  const service = document.getElementById('bService').value || '';
  const offer = document.getElementById('bOffer').value.trim() || '';
  hideErr('c30Error');
  setBtn('c30Btn', true, 'Generating 30-day plan...');
  try {
    const d = await apiCall({ type:'content30', biz, city, service, offer, _button: 'Generate 30-Day Content Plan' });
    const weeks = d.weeks || [];
    if (weeks.length === 0) throw new Error('No content weeks returned. Please try again.');
    const body = document.getElementById('contentBody');
    body.innerHTML = '';
    weeks.forEach(week => {
      const wDiv = document.createElement('div'); wDiv.className = 'c30-week';
      wDiv.innerHTML = `<div class="c30-week-title">Week ${week.week}${week.theme ? ' — ' + esc(week.theme) : ''}</div>`;
      (week.posts || []).forEach(post => {
        const pDiv = document.createElement('div'); pDiv.className = 'c30-post';
        // Support both new field names (postType, idea, captionIdea) and legacy (type, concept, cta)
        const postType    = post.postType    || post.type    || 'Post';
        const idea        = post.idea        || post.concept || '';
        const captionIdea = post.captionIdea || post.cta     || '';
        const goal        = post.goal        || '';
        pDiv.innerHTML = `
          <div class="c30-meta">
            <span class="c30-badge c30-plat">${esc(post.platform||'')}</span>
            <span class="c30-badge c30-type">${esc(postType)}</span>
            <span class="c30-badge c30-goal">${esc(goal)}</span>
          </div>
          <div class="c30-concept"><strong>Day ${post.day||''}:</strong> ${esc(idea)}</div>
          <div class="c30-cta">${esc(captionIdea)}</div>`;
        wDiv.appendChild(pDiv);
      });
      body.appendChild(wDiv);
    });
    document.getElementById('contentPanel').classList.add('show');
  } catch(e) { showErr('c30Error', '30-day plan failed: ' + e.message); }
  setBtn('c30Btn', false, '📅 Generate 30-Day Content Plan');
}

function showTargeting() { document.getElementById('targetPanel').classList.add('show'); }

// ── CANVAS ────────────────────────────────────────────────
function renderCanvas() {
  const biz = document.getElementById('bBiz').value.trim() || 'Your Business';
  const headline = document.getElementById('bHeadline').value.trim() || 'Professional Lawn Care';
  const subtext = document.getElementById('bSubtext').value.trim() || 'Licensed & Insured • Free Estimates';
  const cta = document.getElementById('bCta').value.trim() || 'Call Now for Free Estimate';
  const offer = document.getElementById('bOffer').value.trim();
  const city = document.getElementById('bCity').value.trim();
  const offerBadge = curAd.offerBadge || (offer || 'FREE ESTIMATE').toUpperCase();
  const trustLine = curAd.trustLine || 'Licensed & Insured • Free Estimates • Locally Trusted';
  const d1 = curAd.detailLine1 || 'Same-Week Service Available';
  const d2 = curAd.detailLine2 || 'Satisfaction Guaranteed';
  const urgency = curAd.urgencyLine || 'Limited spots available';
  const cityLine = curAd.cityLine || city.toUpperCase();
  const W = 1080, H = curLayout === 'portrait' ? 1350 : 1080;
  const canvas = document.getElementById('adCanvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const ad = { biz, headline, subtext, cta, offerBadge, trustLine, d1, d2, urgency, cityLine };
  if (curTmpl === 'beforeafter') tmplBA(ctx, W, H, ad);
  else if (curTmpl === 'spotsopen') tmplSO(ctx, W, H, ad);
  else if (curTmpl === 'springoffer') tmplSP(ctx, W, H, ad);
  else if (curTmpl === 'testimonial') tmplTEST(ctx, W, H, ad);
  else if (curTmpl === 'multiservice') tmplMULTI(ctx, W, H, ad);
  drawWM(ctx, W, H);
  canvas.style.display = 'block';
  document.getElementById('canvasEmpty').style.display = 'none';
  document.getElementById('dlBtn').style.display = 'flex';
  document.getElementById('rrBtn2').style.display = 'flex';
  document.getElementById('canvasLabel').textContent = (isPro ? '✓ Pro — clean download' : '⚠️ Free — watermark on download') + ' · ' + (curLayout === 'portrait' ? '1080×1350' : '1080×1080');
  const maxW = document.getElementById('canvasArea').clientWidth - 48, scale = Math.min(1, maxW / W);
  canvas.style.width = (W*scale)+'px'; canvas.style.height = (H*scale)+'px';
}

// ── TEMPLATES ─────────────────────────────────────────────
function tmplBA(ctx, W, H, a) {
  const mid = W/2, imgH = H*.56;
  if (img1){ctx.save();ctx.beginPath();ctx.rect(0,0,mid,imgH);ctx.clip();dCover(ctx,img1,0,0,mid,imgH);ctx.restore();}
  else{ctx.fillStyle='#1a2e1a';ctx.fillRect(0,0,mid,imgH);ctx.fillStyle='rgba(255,255,255,.1)';ctx.font='bold 22px Inter,sans-serif';ctx.textAlign='center';ctx.fillText('Upload Photo 1',mid/2,imgH/2);}
  if (img2){ctx.save();ctx.beginPath();ctx.rect(mid,0,mid,imgH);ctx.clip();dCover(ctx,img2,mid,0,mid,imgH);ctx.restore();}
  else{ctx.fillStyle='#1a3d20';ctx.fillRect(mid,0,mid,imgH);ctx.fillStyle='rgba(255,255,255,.1)';ctx.font='bold 22px Inter,sans-serif';ctx.textAlign='center';ctx.fillText('Upload Photo 2',mid+mid/2,imgH/2);}
  ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(mid,0);ctx.lineTo(mid,imgH);ctx.stroke();
  const g=ctx.createLinearGradient(0,imgH*.5,0,imgH);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=g;ctx.fillRect(0,0,W,imgH);
  dBadge(ctx,'BEFORE',28,28,'#ef4444','#fff');dBadge(ctx,'AFTER',mid+28,28,'#2ea043','#fff');
  ctx.fillStyle='rgba(255,255,255,.65)';ctx.font='500 16px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.d1,W/2,imgH-18);
  ctx.fillStyle='#0d1117';ctx.fillRect(0,imgH,W,H-imgH);
  if(a.offerBadge){ctx.fillStyle='#facc15';rr(ctx,W/2-215,imgH+16,430,52,10);ctx.fillStyle='#1a1a1a';ctx.font='bold 24px Oswald,sans-serif';ctx.textAlign='center';ctx.fillText(a.offerBadge,W/2,imgH+48);}
  ctx.fillStyle='#3fb950';ctx.font='700 20px Inter,sans-serif';ctx.textAlign='center';ctx.fillText((a.biz+(a.cityLine?'  •  '+a.cityLine:'')).toUpperCase(),W/2,imgH+(a.offerBadge?88:48));
  ctx.fillStyle='#fff';ctx.font='800 56px Oswald,Inter,sans-serif';wt(ctx,a.headline.toUpperCase(),W/2,imgH+(a.offerBadge?155:108),W-80,66,'center');
  ctx.fillStyle='#8b949e';ctx.font='400 20px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.trustLine,W/2,H-106);
  ctx.fillStyle='rgba(255,255,255,.45)';ctx.font='400 17px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.d2,W/2,H-82);
  ctx.fillStyle='#2ea043';rr(ctx,60,H-72,W-120,60,12);ctx.fillStyle='#fff';ctx.font='bold 26px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.cta,W/2,H-32);
}
function tmplSO(ctx, W, H, a) {
  if(img1){dCover(ctx,img1,0,0,W,H);}else{ctx.fillStyle='#0d2010';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.07)';ctx.font='bold 24px Inter,sans-serif';ctx.textAlign='center';ctx.fillText('Upload Background Photo',W/2,H/2);}
  const ov=ctx.createLinearGradient(0,0,0,H);ov.addColorStop(0,'rgba(0,0,0,.62)');ov.addColorStop(.5,'rgba(0,0,0,.46)');ov.addColorStop(1,'rgba(0,0,0,.9)');ctx.fillStyle=ov;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2ea043';ctx.fillRect(0,0,W,10);
  if(a.cityLine){ctx.fillStyle='rgba(46,160,67,.22)';rr(ctx,W/2-115,26,230,34,17);ctx.fillStyle='#56d364';ctx.font='700 15px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.cityLine,W/2,48);}
  if(a.offerBadge){ctx.fillStyle='#facc15';rr(ctx,W/2-190,68,380,54,27);ctx.fillStyle='#1a1a1a';ctx.font='bold 26px Oswald,sans-serif';ctx.textAlign='center';ctx.fillText(a.offerBadge,W/2,103);}
  ctx.fillStyle='rgba(255,255,255,.65)';ctx.font='500 21px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.biz,W/2,a.offerBadge?148:104);
  ctx.fillStyle='#fff';ctx.font='800 82px Oswald,sans-serif';ctx.textAlign='center';wt(ctx,a.headline.toUpperCase(),W/2,H*.36,W-80,94,'center');
  ctx.fillStyle='#2ea043';ctx.fillRect(W/2-60,H*.56,120,4);
  const bullets=a.subtext.split(/[,\n]/).map(s=>s.trim()).filter(Boolean).slice(0,4);
  ctx.fillStyle='#e6edf3';ctx.font='400 25px Inter,sans-serif';ctx.textAlign='center';
  bullets.forEach((b,i)=>ctx.fillText('✓  '+b,W/2,H*.62+i*44));
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='500 18px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.urgency+'  •  '+a.d2,W/2,H-118);
  ctx.fillStyle='rgba(255,255,255,.38)';ctx.font='400 17px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.trustLine,W/2,H-94);
  ctx.fillStyle='#2ea043';ctx.fillRect(0,H-98,W,98);ctx.fillStyle='#fff';ctx.font='bold 32px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.cta,W/2,H-50);
}
function tmplSP(ctx, W, H, a) {
  if(img1){dCover(ctx,img1,0,0,W,H);}else{const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0d1f0a');g.addColorStop(1,'#1a3d0d');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.07)';ctx.font='bold 24px Inter,sans-serif';ctx.textAlign='center';ctx.fillText('Upload Background Photo',W/2,H/2);}
  const ov=ctx.createLinearGradient(0,0,0,H);ov.addColorStop(0,'rgba(0,0,0,.33)');ov.addColorStop(.5,'rgba(0,0,0,.22)');ov.addColorStop(1,'rgba(0,0,0,.91)');ctx.fillStyle=ov;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2ea043';ctx.fillRect(0,0,W,10);
  if(a.offerBadge){ctx.font='bold 26px Oswald,sans-serif';const bw=Math.min(460,ctx.measureText(a.offerBadge).width+60);ctx.fillStyle='#facc15';rr(ctx,30,24,bw,60,12);ctx.fillStyle='#1a1a1a';ctx.textAlign='left';ctx.fillText(a.offerBadge,58,64);}
  ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='600 20px Inter,sans-serif';ctx.textAlign='right';ctx.fillText(a.biz,W-32,56);
  if(a.cityLine){ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='500 17px Inter,sans-serif';ctx.textAlign='right';ctx.fillText(a.cityLine,W-32,80);}
  ctx.fillStyle='#fff';ctx.font='800 90px Oswald,sans-serif';ctx.textAlign='center';wt(ctx,a.headline.toUpperCase(),W/2,H*.42,W-80,102,'center');
  ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='300 27px Inter,sans-serif';ctx.textAlign='center';wt(ctx,a.subtext,W/2,H*.65,W-120,38,'center');
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='500 19px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.d1+'  •  '+a.urgency,W/2,H-120);
  ctx.fillStyle='rgba(255,255,255,.38)';ctx.font='400 17px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.trustLine,W/2,H-96);
  ctx.fillStyle='#2ea043';rr(ctx,80,H-80,W-160,72,36);ctx.fillStyle='#fff';ctx.font='bold 29px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.cta,W/2,H-34);
}
function tmplTEST(ctx, W, H, a) {
  if(img1){dCover(ctx,img1,0,0,W,H);}else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0e1a');g.addColorStop(1,'#111828');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  const ov=ctx.createLinearGradient(0,0,0,H);ov.addColorStop(0,'rgba(0,0,0,.72)');ov.addColorStop(1,'rgba(0,0,0,.88)');ctx.fillStyle=ov;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1d4ed8';ctx.fillRect(0,0,W,10);
  ctx.fillStyle='#facc15';ctx.font='36px Inter,sans-serif';ctx.textAlign='center';ctx.fillText('★★★★★',W/2,78);
  if(a.offerBadge){ctx.fillStyle='rgba(250,204,21,.15)';rr(ctx,W/2-185,94,370,46,23);ctx.fillStyle='#facc15';ctx.font='bold 20px Oswald,sans-serif';ctx.textAlign='center';ctx.fillText(a.offerBadge,W/2,122);}
  ctx.fillStyle='rgba(29,78,216,.35)';ctx.font='110px Georgia,serif';ctx.textAlign='left';ctx.fillText('"',52,H*.42+26);
  ctx.fillStyle='#fff';ctx.font='300 30px Inter,sans-serif';ctx.textAlign='center';wt(ctx,a.headline,W/2,H*.37,W-160,40,'center');
  ctx.fillStyle='rgba(255,255,255,.65)';ctx.font='600 19px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.subtext||('— Happy Customer, '+(a.cityLine||'local area')),W/2,H*.62);
  ctx.fillStyle='rgba(255,255,255,.45)';ctx.font='400 17px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.d1+'  •  '+a.d2,W/2,H*.71);
  ctx.fillStyle='#3fb950';ctx.font='600 19px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.biz+(a.cityLine?'  •  '+a.cityLine:''),W/2,H*.78);
  ctx.fillStyle='rgba(255,255,255,.38)';ctx.font='400 16px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.trustLine,W/2,H-108);
  ctx.fillStyle='#1d4ed8';ctx.fillRect(0,H-92,W,92);ctx.fillStyle='#fff';ctx.font='bold 29px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.cta,W/2,H-50);
}
function tmplMULTI(ctx, W, H, a) {
  if(img1){dCover(ctx,img1,0,0,W,H);}else{const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0d1a0a');g.addColorStop(1,'#1a3515');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  const ov=ctx.createLinearGradient(0,0,0,H);ov.addColorStop(0,'rgba(0,0,0,.6)');ov.addColorStop(.5,'rgba(0,0,0,.5)');ov.addColorStop(1,'rgba(0,0,0,.9)');ctx.fillStyle=ov;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2ea043';ctx.fillRect(0,0,W,10);
  if(a.offerBadge){ctx.fillStyle='#facc15';rr(ctx,W/2-205,22,410,52,26);ctx.fillStyle='#1a1a1a';ctx.font='bold 24px Oswald,sans-serif';ctx.textAlign='center';ctx.fillText(a.offerBadge,W/2,55);}
  ctx.fillStyle='#3fb950';ctx.font='700 18px Inter,sans-serif';ctx.textAlign='center';ctx.fillText((a.biz+(a.cityLine?'  •  '+a.cityLine:'')).toUpperCase(),W/2,a.offerBadge?94:54);
  ctx.fillStyle='#fff';ctx.font='800 70px Oswald,sans-serif';ctx.textAlign='center';wt(ctx,a.headline.toUpperCase(),W/2,a.offerBadge?H*.28:H*.22,W-80,80,'center');
  ctx.fillStyle='#2ea043';ctx.fillRect(W/2-60,H*.47,120,4);
  const services=a.subtext.split(/[,\n]/).map(s=>s.trim()).filter(Boolean).slice(0,5);
  ctx.fillStyle='#e6edf3';ctx.font='400 24px Inter,sans-serif';ctx.textAlign='center';
  services.forEach((s,i)=>ctx.fillText('✓  '+s,W/2,H*.52+i*42));
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='500 18px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.d1+'  •  '+a.urgency,W/2,H-118);
  ctx.fillStyle='rgba(255,255,255,.38)';ctx.font='400 16px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.trustLine,W/2,H-94);
  ctx.fillStyle='#2ea043';ctx.fillRect(0,H-76,W,76);ctx.fillStyle='#fff';ctx.font='bold 29px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(a.cta,W/2,H-35);
}

function dCover(ctx,img,x,y,w,h){const r=Math.max(w/img.width,h/img.height),nw=img.width*r,nh=img.height*r;ctx.drawImage(img,x+(w-nw)/2,y+(h-nh)/2,nw,nh);}
function dBadge(ctx,text,x,y,bg,fg){ctx.font='bold 21px Inter,sans-serif';const tw=ctx.measureText(text).width,p=15,bh=39;ctx.fillStyle=bg;rr(ctx,x,y,tw+p*2,bh,8);ctx.fillStyle=fg;ctx.textAlign='left';ctx.fillText(text,x+p,y+26);}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();ctx.fill();}
function wt(ctx,text,x,y,maxW,lh,align){ctx.textAlign=align;const words=text.split(' ');let line='',cy=y;words.forEach(word=>{const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxW&&line){ctx.fillText(line,x,cy);line=word;cy+=lh;}else line=test;});if(line)ctx.fillText(line,x,cy);}

function dlAd(){
  const canvas=document.getElementById('adCanvas'),a=document.createElement('a');
  a.download='LandscapeAdsAI_'+curTmpl+'_'+curLayout+'.png';a.href=canvas.toDataURL('image/png');a.click();
  toast(isPro?'Ad downloaded — no watermark!':'Downloaded! Upgrade to Pro to remove watermark.');
}

// ── TOOLS PAGE ────────────────────────────────────────────
function toolsCtx() {
  return {
    biz: document.getElementById('tBiz').value.trim() || 'Green Valley Landscaping',
    city: document.getElementById('tCity').value.trim() || 'local area',
    service: document.getElementById('tService').value || 'lawn care',
    offer: 'Free Estimate'
  };
}

async function genOffers() {
  hideErr('offersError'); setBtn('offersBtn', true, 'Generating...');
  try {
    const d = await apiCall({ type:'offers', ...toolsCtx() });
    const grid = document.getElementById('offersGrid'); grid.innerHTML = '';
    (d.offers||[]).forEach(o => {
      const el = document.createElement('div'); el.className = 'offer-item';
      el.innerHTML = `<div class="offer-text">${esc(o.offer||'')}</div><div class="offer-type">${esc(o.type||'')}</div><div class="offer-why">${esc(o.why||'')}</div>`;
      el.onclick = () => { navigator.clipboard.writeText(o.offer||'').then(()=>toast('Offer copied!')); };
      grid.appendChild(el);
    });
  } catch(e) { showErr('offersError', 'Failed: ' + e.message); }
  setBtn('offersBtn', false, 'Generate Offers');
}

async function genHashtags() {
  hideErr('hashError'); setBtn('hashBtn', true, 'Generating...');
  try {
    const d = await apiCall({ type:'hashtags', ...toolsCtx() });
    const igEl = document.getElementById('igHashtags'), ttEl = document.getElementById('ttHashtags');
    igEl.innerHTML = ''; ttEl.innerHTML = '';
    (d.instagram||[]).forEach(h => { const el=document.createElement('span');el.className='hashtag';el.textContent=h;el.onclick=()=>{navigator.clipboard.writeText(h).then(()=>toast('Copied: '+h));};igEl.appendChild(el); });
    (d.tiktok||[]).forEach(h => { const el=document.createElement('span');el.className='hashtag';el.textContent=h;el.onclick=()=>{navigator.clipboard.writeText(h).then(()=>toast('Copied: '+h));};ttEl.appendChild(el); });
    document.getElementById('hashTips').textContent = d.tips || '';
    document.getElementById('hashResult').style.display = 'block';
  } catch(e) { showErr('hashError', 'Failed: ' + e.message); }
  setBtn('hashBtn', false, 'Generate Hashtags');
}
function copyHashtags() {
  const tags = [...document.querySelectorAll('#igHashtags .hashtag')].map(el=>el.textContent).join(' ');
  navigator.clipboard.writeText(tags).then(()=>toast('Instagram hashtags copied!'));
}

async function genBeforeAfter() {
  hideErr('baError'); setBtn('baBtn', true, 'Generating...');
  try {
    const ctx = toolsCtx();
    const d = await apiCall({ type:'beforeafter', ...ctx, offer: document.getElementById('baOffer').value.trim() || 'Free Estimate' });
    document.getElementById('baCaption').textContent = d.caption || '';
    document.getElementById('baHashtags').textContent = d.hashtags || '';
    document.getElementById('baResult').style.display = 'block';
  } catch(e) { showErr('baError', 'Failed: ' + e.message); }
  setBtn('baBtn', false, 'Generate Caption');
}

async function genSeasonal() {
  hideErr('seasonError'); setBtn('seasonBtn', true, 'Generating...');
  try {
    const d = await apiCall({ type:'seasonal', ...toolsCtx() });
    ['spring','summer','fall','winter'].forEach((season, idx) => {
      const key = ['sp','su','fa','wi'][idx];
      const container = document.getElementById(key); container.innerHTML = '';
      const data = d[season] || [];
      data.forEach(item => {
        const el = document.createElement('div'); el.className = 'season-idea';
        el.innerHTML = `<div class="season-idea-title">${esc(item.title||'')}</div><div class="season-idea-desc">${esc(item.idea||'')}</div><div class="season-idea-offer">💰 ${esc(item.offer||'')}</div>`;
        container.appendChild(el);
      });
    });
    document.getElementById('seasonResult').style.display = 'block';
  } catch(e) { showErr('seasonError', 'Failed: ' + e.message); }
  setBtn('seasonBtn', false, 'Generate Seasonal Ideas');
}
function showSeason(btn, id) {
  document.querySelectorAll('.season-tab').forEach(t=>t.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.season-content').forEach(c=>c.classList.remove('show')); document.getElementById(id).classList.add('show');
}

function calcLeads() {
  const budget = parseFloat(document.getElementById('calcBudget').value) || 5;
  const days = parseFloat(document.getElementById('calcDays').value) || 7;
  const jobValue = parseFloat(document.getElementById('calcJobValue').value) || 150;
  const totalSpend = budget * days;
  const reach = Math.round(totalSpend * 150);
  const leadsLow = Math.max(1, Math.round(totalSpend * 0.14));
  const leadsHigh = Math.round(totalSpend * 0.4);
  const jobsLow = Math.max(1, Math.round(leadsLow * 0.25));
  const jobsHigh = Math.round(leadsHigh * 0.35);
  const revLow = jobsLow * jobValue;
  const revHigh = jobsHigh * jobValue;
  document.getElementById('calcSpend').textContent = '$' + totalSpend.toFixed(0);
  document.getElementById('calcReach').textContent = reach.toLocaleString();
  document.getElementById('calcLeadsNum').textContent = leadsLow + '–' + leadsHigh;
  document.getElementById('calcRevenue').textContent = '$' + revLow.toFixed(0) + '–' + revHigh.toFixed(0);
}
calcLeads(); // Init on page load

async function genReviewAd() {
  hideErr('reviewError'); setBtn('reviewBtn', true, 'Generating...');
  try {
    const ctx = toolsCtx();
    const d = await apiCall({ type:'reviewad', ...ctx, reviewText: document.getElementById('reviewText').value.trim(), reviewerName: document.getElementById('reviewerName').value.trim() });
    document.getElementById('rQuote').textContent = d.quote || '';
    document.getElementById('rHeadline').textContent = d.headline || '';
    document.getElementById('rSupporting').textContent = d.supportingText || '';
    document.getElementById('rTrust').textContent = d.trustLine || '';
    document.getElementById('reviewResult').style.display = 'block';
  } catch(e) { showErr('reviewError', 'Failed: ' + e.message); }
  setBtn('reviewBtn', false, 'Generate Testimonial Ad');
}
function copyReviewAd() {
  const text = [document.getElementById('rQuote').textContent, document.getElementById('rHeadline').textContent, document.getElementById('rSupporting').textContent, document.getElementById('rTrust').textContent].join('\n\n');
  navigator.clipboard.writeText(text).then(() => toast('Testimonial ad copied!'));
}

// ── TEXT ADS ──────────────────────────────────────────────
function scoreAd(text){let s=0;const t=text.toLowerCase();if(t.includes('?')||t.includes('tired')||t.includes('struggling'))s+=2;if(t.includes('%')||t.includes('off')||t.includes('free')||t.includes('save'))s+=2;if(t.includes('call')||t.includes('book')||t.includes('get')||t.includes('click'))s+=2;if(text.length>150)s+=2;if(t.includes('today')||t.includes('limited')||t.includes('now'))s+=1;if(t.includes('trusted')||t.includes('rated')||t.includes('insured')||t.includes('guaranteed'))s+=1;return Math.min(s,10);}
function rScore(s){const dots=Array(10).fill(0).map((_,i)=>`<div class="as-dot${i<s?' on':''}"></div>`).join('');const lbl=s>=8?'Excellent':s>=6?'Good':s>=4?'Fair':'Needs Work';const col=s>=8?'var(--g2)':s>=6?'#fde047':s>=4?'#fb923c':'#f87171';return `<div class="as-row"><span class="as-lbl">Ad Score</span><div class="as-dots">${dots}</div><span class="as-val" style="color:${col}">${s}/10 — ${lbl}</span></div>`;}
function makeTextCard(platform,icon,badge,content,biz,city,service){const s=scoreAd(content);const sid='ad-'+platform.replace(/[^a-z]/gi,'');return `<div class="ad-card"><div class="ad-card-head"><div>${icon} ${platform}</div><span style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:100px;background:rgba(46,160,67,.12);color:var(--g3)">${badge}</span></div><div class="ad-card-body"><div class="ad-text" id="${sid}">${esc(content)}</div>${rScore(s)}<div class="ad-actions"><button class="ad-btn copy" onclick="copyEl('${sid}')">📋 Copy</button><button class="ad-btn" onclick="regenOne(this,'${platform}','${esc(biz)}','${esc(city)}','${esc(service)}','${sid}')">🔄 Regen</button><button class="ad-btn" onclick="dlTxt('${platform}','${sid}')">⬇ .txt</button></div></div></div>`;}
function dlTxt(platform,id){const a=document.createElement('a');a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(document.getElementById(id).textContent);a.download=platform.replace(/\s/g,'_')+'_ad.txt';a.click();toast('Downloaded!');}
async function regenOne(btn,platform,biz,city,service,sid){btn.textContent='...';btn.disabled=true;const el=document.getElementById(sid);el.style.opacity='.3';try{const d=await apiCall({type:'regen',platform,biz,city,service});if(d.text){el.textContent=d.text;const sb=el.closest('.ad-card-body').querySelector('.as-row');if(sb)sb.outerHTML=rScore(scoreAd(d.text));}}catch(e){toast('Regen failed: '+e.message);}el.style.opacity='1';btn.textContent='🔄 Regen';btn.disabled=false;}
function switchTab(btn,id){document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.tab-content').forEach(c=>{c.classList.remove('active');c.style.display='none';});const p=document.getElementById('tab-'+id);if(p&&p.innerHTML){p.classList.add('active');p.style.display='block';}}
async function runGenerate(){
  const biz=document.getElementById('gBiz').value.trim(),city=document.getElementById('gCity').value.trim();
  const service=document.getElementById('gService').value,offer=document.getElementById('gOffer').value.trim()||'No offer';
  const target=document.getElementById('gTarget').value||'homeowners',tone=document.getElementById('gTone').value;
  const platforms=[...document.querySelectorAll('.plat-pill.on')].map(p=>p.dataset.p);
  if(!biz||!city||!service){showErr('genError','Fill in business name, city & service.');return;}
  if(!platforms.length){showErr('genError','Select at least one platform.');return;}
  hideErr('genError');
  setBtn('genBtn',true,'Generating...');
  document.getElementById('emptyState').style.display='none';document.getElementById('loadState').style.display='block';
  document.getElementById('tabRow').style.display='none';
  ['fb','ig','gg','tt'].forEach(t=>{const p=document.getElementById('tab-'+t);p.innerHTML='';p.style.display='none';p.classList.remove('active');});
  try{
    const d=await apiCall({type:'generate',biz,city,service,offer,target,tone,platforms,_button:'Copy Generator'});
    const pm={facebook:{id:'fb',icon:'📘',label:'Facebook Ad',badge:'Facebook'},instagram:{id:'ig',icon:'📸',label:'Instagram Caption',badge:'Instagram'},google:{id:'gg',icon:'🔍',label:'Google Ad',badge:'Google'},tiktok:{id:'tt',icon:'🎵',label:'TikTok Script',badge:'TikTok'}};
    let first=null;
    platforms.forEach(p=>{
      const cfg=pm[p]; if(!cfg)return;
      const content=d[p]; if(!content)return;
      document.getElementById('tab-'+cfg.id).innerHTML=makeTextCard(cfg.label,cfg.icon,cfg.badge,content,biz,city,service);
      if(!first)first=cfg.id;
    });
    if(first){document.getElementById('tabRow').style.display='flex';document.getElementById('tab-'+first).style.display='block';document.getElementById('tab-'+first).classList.add('active');document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));const ab=document.querySelector(`.tab-btn[onclick*="'${first}'"]`);if(ab)ab.classList.add('active');}
    usage++;document.getElementById('usageCt').textContent=usage;
  }catch(e){showErr('genError','Generation failed: '+e.message);}
  document.getElementById('loadState').style.display='none';document.getElementById('emptyState').style.display=document.querySelector('.tab-content.active[style*="block"]')?'none':'block';
  setBtn('genBtn',false,'✨ Generate Ad Copy');
}

// ── IDEAS ─────────────────────────────────────────────────
const IDEAS=[
  {cat:'Instagram',tag:'ti',title:'Before & After Post',desc:'Transformations get 4x more engagement.'},
  {cat:'Social',tag:'tf',title:'Seasonal Promo',desc:'Spring cleanup or fall leaf removal campaign.'},
  {cat:'TikTok',tag:'tt',title:'Time-lapse Mow',desc:"15-second time-lapse — top-performing format."},
  {cat:'Strategy',tag:'ts',title:'Referral Program Script',desc:'Turn customers into your best salespeople.'},
  {cat:'Google',tag:'tg',title:'Local Search Ad',desc:'Dominate "lawn care near me" searches.'},
  {cat:'Instagram',tag:'ti',title:'Customer Review Post',desc:'Turn 5-star reviews into social content.'},
  {cat:'TikTok',tag:'tt',title:'Meet the Crew',desc:'Humanize your business — builds trust.'},
  {cat:'Strategy',tag:'ts',title:'Slow Season Plan',desc:'Keep revenue steady through winter.'},
  {cat:'Social',tag:'tf',title:'HOA Community Ad',desc:'Reach entire HOA communities.'},
  {cat:'Instagram',tag:'ti',title:'Services & Pricing',desc:'Clean graphic listing your services.'},
  {cat:'Strategy',tag:'ts',title:'Google Business Tips',desc:'More calls without paying for ads.'},
  {cat:'TikTok',tag:'tt',title:'Equipment Showcase',desc:'Show your gear — builds credibility instantly.'}
];
function initIdeas(){const g=document.getElementById('ideasGrid');if(g.children.length)return;IDEAS.forEach(idea=>{const d=document.createElement('div');d.className='idea-card';d.innerHTML=`<span class="itag ${idea.tag}">${idea.cat}</span><h3>${idea.title}</h3><p>${idea.desc}</p>`;d.onclick=()=>genIdea(idea);g.appendChild(d);});}
async function genIdea(idea){
  const box=document.getElementById('ideaBox'),title=document.getElementById('ideaTitle'),content=document.getElementById('ideaContent'),tips=document.getElementById('ideaTips');
  title.textContent='Generating: '+idea.title+'...';content.textContent='';tips.innerHTML='';box.classList.add('show');box.scrollIntoView({behavior:'smooth',block:'nearest'});
  try{
    const d=await apiCall({type:'idea',ideaTitle:idea.title,ideaCat:idea.cat,ideaDesc:idea.desc});
    title.textContent=idea.title+' — '+idea.cat;
    content.textContent=d.content||'Generation failed.';
    tips.innerHTML=(d.tips||[]).map(t=>`<div class="ir-tip">${esc(t)}</div>`).join('');
  }catch(e){content.textContent='Generation failed: '+e.message;}
}

// ── GROWTH COACH ──────────────────────────────────────────
async function sendCoach(){
  const input=document.getElementById('coachIn');const msg=input.value.trim();if(!msg)return;
  input.value='';document.getElementById('coachSuggs').style.display='none';
  addMsg('user',msg);chatHistory.push({role:'user',content:msg});
  const el=addMsg('ai','...');
  try{
    const d=await apiCall({type:'coach',messages:chatHistory});
    const reply=d.text||'Something went wrong.';chatHistory.push({role:'assistant',content:reply});
    el.querySelector('.mb').textContent=reply;
  }catch(e){el.querySelector('.mb').textContent='Connection failed. Please try again.';}
}
function addMsg(role,text){const wrap=document.getElementById('coachMsgs'),inner=wrap.querySelector('.coach-inner');const d=document.createElement('div');d.className='cmsg '+role;d.innerHTML=(role==='ai'?'<div class="mrole">📈 Growth Coach</div>':'')+`<div class="mb">${esc(text)}</div>`;inner.appendChild(d);wrap.scrollTop=wrap.scrollHeight;return d;}
// ── MARKETING CHECKLIST (client-side, no API) ─────────────
const CHECKLIST = [
  'Get 5 Google Reviews from recent customers',
  'Post before/after photos every week',
  'Run at least one seasonal ad per month',
  'Offer a first-service discount to new customers',
  'Respond to messages and calls within 1 hour',
  'Set up Google Business Profile with photos',
  'Add services and pricing to your Google Business listing',
  'Create or update your Facebook Business page',
  'Post consistently at least 3x per week on social media',
  'Ask every happy customer to leave a review'
];
const checkState = {};
(function initChecklist() {
  const container = document.getElementById('checklistItems');
  if (!container) return;
  CHECKLIST.forEach((item, i) => {
    checkState[i] = false;
    const el = document.createElement('div');
    el.className = 'chk-item'; el.id = 'chk-' + i;
    el.innerHTML = `<div class="chk-box" id="chkbox-${i}"></div><div class="chk-label">${item}</div>`;
    el.onclick = () => toggleCheck(i);
    container.appendChild(el);
  });
  updateChecklistProgress();
})();
function toggleCheck(i) {
  checkState[i] = !checkState[i];
  const el = document.getElementById('chk-' + i);
  const box = document.getElementById('chkbox-' + i);
  if (checkState[i]) { el.classList.add('done'); box.textContent = '✓'; }
  else { el.classList.remove('done'); box.textContent = ''; }
  updateChecklistProgress();
}
function updateChecklistProgress() {
  const done = Object.values(checkState).filter(Boolean).length;
  const total = CHECKLIST.length;
  const pct = Math.round((done / total) * 100);
  const el = document.getElementById('checklistProgress');
  if (el) el.textContent = `${done} of ${total} completed (${pct}%) — ${done === total ? '🎉 All done! Great work.' : done >= 7 ? '💪 Strong foundation.' : done >= 4 ? '📈 Good progress.' : '🚀 Get started — these drive real results.'}`;
}

// ── COMPETITOR AD IDEAS ────────────────────────────────────
async function genCompetitor() {
  hideErr('compError'); setBtn('compBtn', true, 'Generating...');
  try {
    const d = await apiCall({ type:'competitor', ...toolsCtx() });
    const container = document.getElementById('compResult');
    container.innerHTML = '';
    (d.ideas || []).forEach(idea => {
      const el = document.createElement('div'); el.className = 'comp-card';
      el.innerHTML = `<div class="comp-angle">${esc(idea.angle||'')}</div><div class="comp-headline">${esc(idea.headline||'')}</div><div class="comp-offer">💰 ${esc(idea.offer||'')}</div><div class="comp-diff">${esc(idea.differentiator||'')}</div>`;
      container.appendChild(el);
    });
    container.style.display = 'flex';
  } catch(e) { showErr('compError', 'Generation failed: ' + e.message); }
  setBtn('compBtn', false, 'Generate Competitor Ideas');
}

// ── LEAD MAGNET GENERATOR ─────────────────────────────────
async function genLeadMagnets() {
  hideErr('lmError'); setBtn('lmBtn', true, 'Generating...');
  try {
    const d = await apiCall({ type:'leadmagnet', ...toolsCtx() });
    const container = document.getElementById('lmResult');
    container.innerHTML = '';
    (d.magnets || []).forEach(m => {
      const el = document.createElement('div'); el.className = 'lm-card';
      el.innerHTML = `<div class="lm-name">🧲 ${esc(m.name||'')}</div><div class="lm-headline">${esc(m.headline||'')}</div><div class="lm-desc">${esc(m.description||'')}</div><div class="lm-cta">${esc(m.cta||'')}</div><div class="lm-format">Format: ${esc(m.format||'')}</div>`;
      el.onclick = () => {
        const text = `${m.name}\n${m.headline}\n${m.description}\nCTA: ${m.cta}`;
        navigator.clipboard.writeText(text).then(() => toast('Lead magnet copied!'));
      };
      container.appendChild(el);
    });
    container.style.display = 'flex';
  } catch(e) { showErr('lmError', 'Generation failed: ' + e.message); }
  setBtn('lmBtn', false, 'Generate Lead Magnets');
}

function useSugg(btn){document.getElementById('coachIn').value=btn.textContent;sendCoach();}

// ═══════════════════════════════════════════════════════════
// DEBUG PANEL — temporary developer visibility tool
// ═══════════════════════════════════════════════════════════

let debugOpen = false;
// Hide the debug panel entirely when DEBUG=false
(function initDebugVisibility() {
  if (!DEBUG) {
    const wrap = document.getElementById('debugPanelWrap');
    const spacer = document.getElementById('debugSpacer');
    if (wrap) wrap.style.display = 'none';
    if (spacer) spacer.style.height = '0';
  }
})();
const debugEntries = [];

function toggleDebug() {
  debugOpen = !debugOpen;
  document.getElementById('debugPanel').style.display = debugOpen ? 'block' : 'none';
  document.getElementById('debugArrow').textContent = debugOpen ? '▼' : '▲';
  document.getElementById('debugSpacer').style.height = debugOpen ? '420px' : '36px';
}
function clearDebug() {
  debugEntries.length = 0;
  document.getElementById('debugLog').innerHTML = '';
  document.getElementById('debugStatus').textContent = 'Cleared';
}

function dbLog(entry) {
  if (!DEBUG) return; // no-op in production
  debugEntries.unshift(entry); // newest first
  const status = document.getElementById('debugStatus');
  const ok = entry.responseOk && entry.parsed?.ok !== false;
  if (status) { status.textContent = (ok ? '✅' : '❌') + ' Last: ' + entry.button + ' @ ' + entry.ts; status.style.color = ok ? '#34d399' : '#f87171'; }
  renderDebugLog();
}

function renderDebugLog() {
  if (!DEBUG) return;
  const log = document.getElementById('debugLog');
  if (!log) return;
  log.innerHTML = debugEntries.map((e, i) => {
    const ok = e.responseOk && e.parsed?.ok !== false;
    const bg = i === 0 ? '#1a1a2e' : '#111118';
    const border = ok ? '#065f46' : '#7f1d1d';
    const headerColor = ok ? '#34d399' : '#f87171';

    // Safely stringify for display
    const payloadStr = safeStringify(e.payload);
    const parsedStr  = e.parsed  ? safeStringify(e.parsed)  : '(not parsed)';
    const rawTrunc   = e.rawText ? (e.rawText.length > 2000 ? e.rawText.slice(0, 2000) + '\n… (truncated)' : e.rawText) : '(empty)';

    return `<div style="border-left:3px solid ${border};background:${bg};padding:10px 14px;margin-bottom:1px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
    <span style="color:${headerColor};font-weight:700;font-size:13px;">${ok ? '✅' : '❌'} ${escD(e.button)}</span>
    <span style="color:#6b7280;font-size:11px;">${escD(e.ts)}</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px;">
    <div><span style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Type sent</span><br><span style="color:#e5e7eb;">${escD(e.type)}</span></div>
    <div><span style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;">HTTP status</span><br><span style="color:${e.httpStatus===200?'#34d399':'#f87171'};">${e.httpStatus || '—'}</span></div>
    <div><span style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Response ok</span><br><span style="color:${e.responseOk?'#34d399':'#f87171'};">${e.responseOk ? 'true' : 'false'}</span></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px;">
    <div><span style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;">parsed.ok</span><br><span style="color:${e.parsed?.ok?'#34d399':'#f87171'};">${e.parsed ? String(e.parsed.ok) : 'N/A'}</span></div>
    <div><span style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Parse result</span><br><span style="color:${e.parseOk?'#34d399':'#f87171'};">${e.parseOk ? 'OK' : 'FAILED'}</span></div>
    <div><span style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Error</span><br><span style="color:#f87171;word-break:break-all;">${escD(e.error || e.parsed?.error || '—')}</span></div>
  </div>
  ${e.parsed?.rawText ? `<details style="margin-bottom:6px;"><summary style="color:#fbbf24;cursor:pointer;font-size:11px;">⚠️ Backend rawText (what OpenAI returned before parse)</summary><pre style="background:#0a0a14;color:#d1d5db;padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;font-size:11px;margin-top:4px;">${escD(e.parsed.rawText)}</pre></details>` : ''}
  <details><summary style="color:#60a5fa;cursor:pointer;font-size:11px;">📤 Request payload</summary><pre style="background:#0a0a14;color:#d1d5db;padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;font-size:11px;margin-top:4px;">${escD(payloadStr)}</pre></details>
  <details><summary style="color:#a78bfa;cursor:pointer;font-size:11px;">📥 Parsed response object</summary><pre style="background:#0a0a14;color:#d1d5db;padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;font-size:11px;margin-top:4px;">${escD(parsedStr)}</pre></details>
  <details><summary style="color:#6b7280;cursor:pointer;font-size:11px;">📄 Raw response text</summary><pre style="background:#0a0a14;color:#9ca3af;padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;font-size:11px;margin-top:4px;">${escD(rawTrunc)}</pre></details>
</div>`;
  }).join('');
}

function safeStringify(obj) {
  try { return JSON.stringify(obj, null, 2); }
  catch(e) { return String(obj); }
}
function escD(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── DEBUG-AWARE apiCall ────────────────────────────────────
// Replaces the original apiCall — same interface, adds full debug logging
async function apiCall(payload) {
  const ts = new Date().toLocaleTimeString();
  const entry = {
    button: payload._button || payload.type || 'unknown',
    type: payload.type,
    ts,
    payload: { ...payload, _button: undefined }, // strip internal _button key
    httpStatus: null,
    responseOk: false,
    rawText: '',
    parsed: null,
    parseOk: false,
    error: null
  };

  // Strip the internal _button key before sending
  const sendPayload = { ...payload };
  delete sendPayload._button;

  let resp;
  try {
    resp = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendPayload)
    });
    entry.httpStatus = resp.status;
  } catch(fetchErr) {
    entry.error = 'Fetch failed: ' + fetchErr.message;
    dbLog(entry);
    throw fetchErr;
  }

  // Read raw text first — never assume JSON
  let rawText = '';
  try { rawText = await resp.text(); }
  catch(e) { rawText = '(could not read response body)'; }
  entry.rawText = rawText;

  // Try to parse as JSON
  let parsed = null;
  let parseOk = false;
  try {
    parsed = JSON.parse(rawText);
    parseOk = true;
  } catch(e) {
    entry.parseOk = false;
    entry.error = 'Response was not valid JSON. Raw: ' + rawText.slice(0, 300);
    dbLog(entry);
    throw new Error('Response was not valid JSON: ' + rawText.slice(0, 200));
  }

  entry.parsed = parsed;
  entry.parseOk = parseOk;
  entry.responseOk = resp.ok;

  if (!resp.ok || parsed?.ok === false) {
    entry.error = parsed?.error || `HTTP ${resp.status}`;
    dbLog(entry);
    throw new Error(parsed?.error || `HTTP ${resp.status}`);
  }

  dbLog(entry);
  return parsed;
}

</script>

<!-- ======= DEBUG PANEL ======= -->
<div id="debugPanelWrap" style="position:fixed;bottom:0;left:0;right:0;z-index:9000;font-family:monospace;">
  <div id="debugToggle" onclick="toggleDebug()" style="background:#1a1a2e;border-top:2px solid #f59e0b;padding:6px 16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none;">
    <span style="color:#f59e0b;font-weight:700;font-size:12px;">🐛 Developer Debug Panel</span>
    <span style="display:flex;gap:12px;align-items:center;">
      <span id="debugStatus" style="color:#6b7280;font-size:11px;font-family:monospace;">No requests yet — click any AI button</span>
      <button onclick="event.stopPropagation();clearDebug()" style="background:#374151;border:1px solid #4b5563;color:#9ca3af;padding:2px 8px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:11px;">Clear</button>
      <span id="debugArrow" style="color:#f59e0b;font-size:12px;">▲</span>
    </span>
  </div>
  <div id="debugPanel" style="display:none;background:#0f0f1a;border-top:1px solid #374151;max-height:400px;overflow-y:auto;">
    <div style="padding:8px 14px;background:#111118;border-bottom:1px solid #1f2937;font-size:11px;color:#6b7280;">
      Logs every AI request/response. Newest entry on top. Expand sections to see full data.
    </div>
    <div id="debugLog"></div>
  </div>
</div>
<div id="debugSpacer" style="height:36px;"></div>

</body>
</html>
