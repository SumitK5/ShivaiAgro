const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Replace body[data-page="about"] .nav-inner {...} entirely
css = css.replace(/body\[data-page="about"\] \.nav-inner\s*\{[^}]+\}/, '');

fs.writeFileSync('style.css', css);
