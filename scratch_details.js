const fs = require('fs');
const content = fs.readFileSync('C:/Users/zion/Downloads/element (4).html', 'utf8');

const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>');
const css = content.slice(styleStart, styleEnd);

function findRules(selector) {
  const results = [];
  const regex = new RegExp(`([^}{]*\\.${selector}\\b[^}{]*\\{[^}]*\\})`, 'g');
  let m;
  while ((m = regex.exec(css)) !== null) {
    if (!m[1].includes('::backdrop') && !m[1].includes('.component,') && !m[1].includes('.main,')) {
      results.push(m[1].trim());
    }
  }
  return results;
}

const list = [
  'section-5', 'wrapper-199', 'wrapper-200', 'wrapper-201', 'text-68', 'heading-3', 'text-69',
  'wrapper-202', 'wrapper-203', 'label-127', 'label-128',
  'list-3', 'item-7', 'wrapper-204', 'label-129', 'heading-4', 'text-70', 'wrapper-205'
];

let output = '';
list.forEach(item => {
  output += `\n/* ==================== ${item} ==================== */\n`;
  const r = findRules(item);
  output += r.join('\n\n') + '\n';
});

fs.writeFileSync('scratch_details_utf8.txt', output, 'utf8');
console.log('Done writing utf8 details');
