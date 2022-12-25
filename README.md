#### This is a fork of https://github.com/latitudegames/GPT-3-Encoder. I made this fork so I could apply some PRs that had been sent to the upstream repo.

    changelog: 
        add countTokens function
        add tokenStats function
        updated docs (npm run docs)


# GPT-3-Encoder
Javascript BPE Encoder Decoder for GPT-2 / GPT-3

## About
GPT-2 and GPT-3 use byte pair encoding to turn text into a series of integers to feed into the model. This is a javascript implementation of OpenAI's original python encoder/decoder which can be found [here](https://github.com/openai/gpt-2)

## Install with npm

```
npm install @syonfox/gpt-3-encoder
```


## Usage
<a href="https://www.npmjs.com/package/@syonfox/gpt-3-encoder">
  <img src="https://img.shields.io/npm/v/@syonfox/gpt-3-encoder.svg" alt="npm version">
</a>

<a href="https://github.com/syonfox/GPT-3-Encoder#readme">View on GitHub</a>

<a href="https://syonfox.github.io/GPT-3-Encoder/">View Docs Pages</a>

Compatible with Node >= 12

```js

import {encode, decode, countTokens, tokenStats} from "gpt-3-encoder"
//or
const {encode, decode, countTokens, tokenStats} = require('gpt-3-encoder')

const str = 'This is an example sentence to try encoding out on!'
const encoded = encode(str)
console.log('Encoded this string looks like: ', encoded)

console.log('We can look at each token and what it represents')
for(let token of encoded){
  console.log({token, string: decode([token])})
}

//example count tokens usage
if(countTokens(str) > 5) {
    console.log("String is over five tokens, inconcevable");
}

const decoded = decode(encoded)
console.log('We can decode it back into:\n', decoded)

```


## Developers 

```sh
git clone https://github.com/syonfox/GPT-3-Encoder.git

cd GPT-3-Encoder

npm install

npm run test
npm run docs

less Encoder.js

firefox ./docs/index.html

npm publish --access public



```

## todo 

More stats that work well with this token representation.

Clean up and keep it simple. 

more tests.

performance analysis 

There are several performance improvements that could be made to the encode function:
(from gpt todo vet these recommendations)

    Cache the results of the encodeStr function to avoid unnecessary computation. You can do this by using a map or an object to store the results of encodeStr for each input string.
    Use a regular expression to match the tokens in the input text instead of using the matchAll function. Regular expressions can be faster and more efficient than matchAll for certain types of patterns.
    Use a different data structure to store the byte_encoder and encoder maps. Objects and maps can have different performance characteristics depending on the size and complexity of the data. You may want to experiment with different data structures to see which one works best for your use case.
    Use a different data structure to store the bpe_tokens array. Arrays can be slower than other data structures for certain operations, such as appending new elements or concatenating multiple arrays. You may want to consider using a different data structure, such as a linked list or a queue, to store the bpe_tokens array.
    Use a different algorithm to compute the BPE codes for the tokens. The current implementation of the bpe function may be inefficient for large datasets or for datasets with complex patterns. You may want to consider using a different algorithm, such as a divide-and-conquer or a hashing-based approach, to compute the BPE codes more efficiently.



