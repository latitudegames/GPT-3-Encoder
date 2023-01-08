// import {encode, decode, countTokens, tokenStats} from "gpt-3-encoder"
//or

const {encode, decode, countTokens, tokenStats} = require('../index')

const str = 'This is an example sentence to try encoding out on!'
const encoded = encode(str)
console.log('Encoded this string looks like: ', encoded)

console.log('We can look at each token and what it represents')
for (let token of encoded) {
    console.log({token, string: decode([token])})
}

//example count tokens usage
if (countTokens(str) > 5) {
    console.log("String is over five tokens, inconcevable");
}


console.log("String Token Stats: ", tokenStats("foo foo bar bar baz"));

const decoded = decode(encoded)
console.log('We can decode it back into:\n', decoded)
