const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const newNav = `#nav{
  position:fixed;top:0;left:0;right:0;z-index:500;
  transition:background 0.4s var(--ease-inout),backdrop-filter 0.4s,box-shadow 0.4s;
}
#nav.scrolled{
  background:rgba(247,245,240,0.92);
  backdrop-filter:saturate(180%) blur(24px);
  -webkit-backdrop-filter:saturate(180%) blur(24px);
  box-shadow:0 1px 0 rgba(0,0,0,0.06);
  height: 76px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 100px;
  display: flex;
}
.nav-inner{
    align-items: center;
    justify-content: space-between;
    height: 76px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px 100px;
    background: rgba(255, 255, 255, .1);
    display: flex;
    backdrop-filter: blur(10px);
    border-bottom: 2px solid rgba(255, 255, 255, .2);
    transition:background 0.4s var(--ease-inout),backdrop-filter 0.4s,box-shadow 0.4s;
}

/* ── ABOUT US SECTION NAV OVERRIDES (NO GLASS BLUR EFFECT) ── */
body[data-page="about"] #nav,
body[data-page="about"] #nav.scrolled,
body[data-page="about"] .nav-inner {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

body[data-page="about"] #nav {
  background: var(--surface-warm);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
}

body[data-page="about"] .nav-inner {
  background: var(--surface-warm);
  border-bottom: 1px solid var(--border);
  backdrop-filter: none !important;
}`;

css = css.replace(/#nav\s*\{[\s\S]*?body\[data-page="about"\] #nav\.scrolled\s*\{[^}]+\}/, newNav);

fs.writeFileSync('style.css', css);
