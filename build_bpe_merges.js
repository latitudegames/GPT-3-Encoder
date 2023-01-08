const fs = require('fs');
const path = require('path');

const bpe_file = fs.readFileSync(path.join(__dirname, './vocab.bpe'), 'utf-8');

const lines = bpe_file.split('\n');

// bpe_merges = [tuple(merge_str.split()) for merge_str in bpe_data.split("\n")[1:-1]]
const bpe_merges = lines.slice(1, lines.length - 1).map(x => {
  return x.split(/(\s+)/).filter(function(e) { return e.trim().length > 0; });
});

fs.writeFileSync('./bpe_merges.js', `module.exports = ${JSON.stringify(bpe_merges)};`);
