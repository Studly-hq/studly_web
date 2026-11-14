const fs = require('fs');
const content = fs.readFileSync('C:/Users/zion/Downloads/element (4).html', 'utf8');

const s5start = content.indexOf('<section class="section-5">');
const s5end = content.indexOf('</section>', s5start);
const s5 = content.slice(s5start, s5end);

// Print item-7, item-8, item-9 inner wrapper-205, wrapper-212, wrapper-226
const w205 = s5.slice(s5.indexOf('<div\n                      class="wrapper-205"'), s5.indexOf('</li>\n                  <li class="item-8">'));
const w212 = s5.slice(s5.indexOf('<div\n                      class="wrapper-212"'), s5.indexOf('</li>\n                  <li class="item-9">'));
const w226 = s5.slice(s5.indexOf('<div\n                      class="wrapper-226"'), s5.indexOf('</li>\n                </ol>'));

console.log('--- CARD 1 ILLUSTRATION HTML ---');
console.log(w205);
console.log('--- CARD 2 ILLUSTRATION HTML ---');
console.log(w212);
console.log('--- CARD 3 ILLUSTRATION HTML ---');
console.log(w226);
