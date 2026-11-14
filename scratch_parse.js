const fs = require('fs');
const content = fs.readFileSync('C:/Users/zion/Downloads/element (4).html', 'utf8');

const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>');
const css = content.slice(styleStart, styleEnd);

const sectionHtml = fs.readFileSync('scratch_section5.html', 'utf8');
const classMatches = [...new Set(sectionHtml.match(/class="([^"]+)"/g).flatMap(m => m.replace('class="', '').replace('"', '').split(' ')))];

console.log('Classes found:', classMatches);

let cssRules = [];
classMatches.forEach(cls => {
  // search css for .cls
  const regex = new RegExp(`([^}{]*\\.${cls}\\b[^}{]*\\{[^}]*\\})`, 'g');
  let match;
  while ((match = regex.exec(css)) !== null) {
    cssRules.push(match[1].trim());
  }
});

// Also search for media queries containing these classes
console.log('--- Unique CSS Rules found ---');
console.log([...new Set(cssRules)].join('\n\n'));
