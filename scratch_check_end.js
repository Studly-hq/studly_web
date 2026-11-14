const fs = require('fs');
const content = fs.readFileSync('C:/Users/zion/Downloads/element (4).html', 'utf8');
const s5start = content.indexOf('<section class="section-5">');
const s5end = content.indexOf('</section>', s5start);
console.log(content.slice(s5end - 100, s5end + 300));
