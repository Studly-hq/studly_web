const fs = require('fs');
const content = fs.readFileSync('C:/Users/zion/Downloads/element (4).html', 'utf8');

const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>');
const css = content.slice(styleStart, styleEnd);

const targets = [
  'section-5', 'wrapper-199', 'wrapper-200', 'wrapper-201', 'wrapper-202', 'wrapper-203',
  'list-3', 'item-7', 'item-8', 'item-9', 'wrapper-204', 'wrapper-211', 'wrapper-225',
  'label-129', 'label-137', 'label-143', 'heading-4', 'heading-5', 'heading-6',
  'text-70', 'text-71', 'text-81', 'wrapper-205', 'wrapper-212', 'wrapper-226'
];

targets.forEach(t => {
  console.log(`=== Target: ${t} ===`);
  const regex = new RegExp(`([^}{]*\\.${t}[^}{]*\\{[^}]*\\})`, 'g');
  let m;
  while ((m = regex.exec(css)) !== null) {
    if (!m[1].includes('::backdrop') && !m[1].includes('.component,')) {
      console.log(m[1].trim());
    }
  }
});
