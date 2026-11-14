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
  'wrapper-206', 'wrapper-207', 'label-130', 'wrapper-208', 'label-131', 'label-132',
  'wrapper-209', 'label-133', 'label-134', 'wrapper-210', 'label-135', 'label-136',
  'wrapper-213', 'text-72', 'wrapper-214', 'label-138', 'text-75', 'wrapper-221', 'wrapper-223',
  'wrapper-227', 'wrapper-228', 'text-82', 'wrapper-229', 'label-144', 'label-145', 'wrapper-230', 'text-83', 'text-84'
];

let output = '';
list.forEach(item => {
  output += `\n/* ==================== ${item} ==================== */\n`;
  const r = findRules(item);
  output += r.join('\n\n') + '\n';
});

fs.writeFileSync('scratch_illus_css.txt', output, 'utf8');
console.log('Done writing illus css');
