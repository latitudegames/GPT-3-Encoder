const fs = require('fs');
const path = require('path');

const bpe_file = fs.readFileSync(path.join(__dirname, './vocab.bpe'), 'utf-8');

const lines = bpe_file.split('\n');

const encoder = JSON.parse(fs.readFileSync(path.join(__dirname, './encoder.json')));

console.log("Breaks stuff i think");

fs.writeFileSync('./encoder2.js', `module.exports = ${JSON.stringify(encoder)};`);
