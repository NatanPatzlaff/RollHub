const fs = require('fs');
const p1 = fs.readFileSync('part1.md', 'utf8');
const p2 = fs.readFileSync('part2.md', 'utf8');
const p3 = fs.readFileSync('part3.md', 'utf8');

fs.writeFileSync('Rituais.md', p1 + '\n\n' + p2 + '\n\n' + p3);
console.log('Concatenated successfully.');
