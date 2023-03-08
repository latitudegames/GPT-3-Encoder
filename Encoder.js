

const encoder = require("./encoder");

// This file includes code which was modified from https://github.com/openai/gpt-2
const bpe_ranks = require("./bpe_ranks");

//The old version used to include this but i prebuild it into a js file to be loaded by browserify
//todo delete old comments when not needed
// const fs = require('fs')
// const path = require('path');
// const json-loder
// const loader = require("json-loader");

// const encoder = loader('./encoder.json');
// const encoder = JSON.parse(fs.readFileSync(path.join(__dirname, './encoder.json')));
// const bpe_file = fs.readFileSync(path.join(__dirname, './vocab.bpe'), 'utf-8');

const range = (x, y) => {
    const res = Array.from(Array(y).keys()).slice(x)
    return res
}

const ord = x => {
    return x.charCodeAt(0)
}

const chr = x => {
    return String.fromCharCode(x)
}

const encodeStr = str => {
    return Array.from(Buffer.from(str, 'utf-8')).map(x => x.toString());
}

const decodeStr = arr => {
    return Buffer.from(arr).toString('utf-8')
}

function bytes_to_unicode() {
    const bs = range(ord('!'), ord('~') + 1).concat(range(ord('¡'), ord('¬') + 1), range(ord('®'), ord('ÿ') + 1))

    let cs = bs.slice()
    let n = 0
    for (let b = 0; b < 2 ** 8; b++) {
        if (!bs.includes(b)) {
            bs.push(b)
            cs.push(2 ** 8 + n)
            n = n + 1
        }
    }

    cs = cs.map(x => chr(x))

    const result = {}
    bs.map((_, i) => {
        result[bs[i]] = cs[i]
    })
    return result
}

function get_pairs(word) {
    const pairs = new Set()
    let prev_char = word[0]
    for (let i = 1; i < word.length; i++) {
        const char = word[i]
        pairs.add([prev_char, char])
        prev_char = char
    }
    return pairs
}

const pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu
// The regular expression pat is used to split a string into an array of tokens.
//
// The regular expression consists of several parts:
//     's|'t|'re|'ve|'m|'ll|'d: These are all short forms of common English words (e.g. "is", "not", "have"). The | symbol means "or", so this part of the expression matches any of these short forms.
//
//     ?\p{L}+: This matches one or more consecutive letters (i.e. "words"). The ? means that the preceding space character is optional, so this part of the expression will match both words with spaces before and after them, as well as words without spaces.
//
//     ?\p{N}+: This matches one or more consecutive numbers. Like the previous part of the expression, the ? means that the preceding space character is optional.
//
//     ?[^\s\p{L}\p{N}]+: This matches one or more consecutive non-letter, non-number characters (e.g. punctuation, symbols). The [^...] notation means "any character except the ones listed inside the brackets", and \s represents whitespace characters. The \p{L} and \p{N} shorthand character classes represent letters and numbers, respectively. The + symbol means "one or more occurrences", and the ? means that the preceding space character is optional.
//
//     \s+(?!\S): This matches one or more consecutive whitespace characters that are followed by a non-whitespace character. The \S shorthand character class represents non-whitespace characters, and the (?!...) notation is a negative lookahead assertion, which means "do not match if the pattern inside the parentheses is present". This part of the expression is used to match leading and trailing whitespace characters.
//
//     \s+: This matches one or more consecutive whitespace characters. This part of the expression is used to match sequences of multiple whitespace characters within the string.
//
// The g flag at the end of the regular expression means "global", which means that the regular expression will continue to search for matches after the first one is found. The u flag means "Unicode", which enables the use of Unicode character classes like \p{L} and \p{N}.
//
// Overall, this regular expression is used to split a string into an array of tokens by matching words, numbers, and non-letter, non-number characters, as well as leading and trailing whitespace and sequences of multiple whitespace characters within the string.

const decoder = {}
Object.keys(encoder).map(x => {
    decoder[encoder[x]] = x
})


const byte_encoder = bytes_to_unicode()
const byte_decoder = {}
Object.keys(byte_encoder).map(x => {
    byte_decoder[byte_encoder[x]] = x
})


const cache = new Map;

/**
 * Implements the Byte Pair Encoding (BPE) algorithm for subword tokenization.
 *
 * The BPE algorithm operates on a vocabulary of subwords, and works by iteratively replacing the most frequent pair of
 * subwords in the vocabulary with a new subword, until a specified vocabulary size is reached. This results in a
 * of subwords that can be used to represent words in a language, while still maintaining some of the structure and
 * meaning of the original words.
 *
 * Here's a breakdown of the function:
 *  1 The function first checks if the input token is in the cache, and if it is, it returns the cached value. This is likely to improve performance by avoiding unnecessary processing for tokens that have already been processed.
 *  2 The input token is then split into individual characters, and a list of pairs of adjacent characters (bigrams) is generated using the get_pairs function. If there are no pairs, the input token is returned as is.
 *  3 The function then enters a loop that continues until a termination condition is met. In each iteration, the pair of subwords with the lowest rank (as determined by the bpe_ranks object) is identified and stored in the bigram variable. If the bigram is not in bpe_ranks, the loop terminates.
 *  4 The bigram is then replaced with a new subword in the word list. The word list is iterated over and any instances of the bigram are replaced with the new subword.
 *  5 The word list is then joined back into a string and stored in the cache. The cached string is returned as the result of the function.
 * @param {string} token - The input token to be tokenized.
 * @return {string} word - The tokenized subwords as a string.
 */
function bpe(token) {
    if (cache.has(token)) {
        return cache.get(token)
    }

    let word = token.split('')

    let pairs = get_pairs(word)

    if (!pairs) {
        return token
    }

    while (true) {
        const minPairs = {}
        Array.from(pairs).map(pair => {
            const rank = bpe_ranks[pair]
            minPairs[(isNaN(rank) ? 10e10 : rank)] = pair
        })


        const bigram = minPairs[Math.min(...Object.keys(minPairs).map(x => {
                return parseInt(x)
            }
        ))]

        if (!(bigram in bpe_ranks)) {
            break
        }

        const first = bigram[0]
        const second = bigram[1]
        let new_word = []
        let i = 0

        while (i < word.length) {
            const j = word.indexOf(first, i)
            if (j === -1) {
                new_word = new_word.concat(word.slice(i))
                break
            }
            new_word = new_word.concat(word.slice(i, j))
            i = j

            if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
                new_word.push(first + second)
                i = i + 2
            } else {
                new_word.push(word[i])
                i = i + 1
            }
        }

        word = new_word
        if (word.length === 1) {
            break
        } else {
            pairs = get_pairs(word)
        }
    }

    word = word.join(' ')
    cache.set(token, word)

    return word
}

/**
 * Encodes a given text string into a list of BPE tokens.
 *
 * @param {string} text - The text to be encoded.
 * @return {Array} bpe_tokens - The encoded BPE tokens.
 */
function encode(text) {
    if (typeof text != "string") {
        if (typeof text == "undefined") {
            console.warn("undefined text returning empty []");
            return [];
        }
        console.warn("casting to string hope thats what you want!");
        text = "" + text;
    }
    let bpe_tokens = []
    const matches = Array.from(text.matchAll(pat)).map(x => x[0])
    for (let token of matches) {
        token = encodeStr(token).map(x => {
            return byte_encoder[x]
        }).join('')

        const new_tokens = bpe(token).split(' ').map(x => encoder[x])
        bpe_tokens = bpe_tokens.concat(new_tokens)
    }
    return bpe_tokens
}

/**
 * Computes count, unique, and frequency statistics for a string or an array of tokens.
 * This function can be used to get insights into the characteristics of a text dataset,
 * or to analyze the distribution of tokens in a body of text.
 *
 * @param {(string|Array<number>)} input - The input string or array of tokens.
 * @return {Object} stats - An object with count, unique, frequency, positions, and tokens properties.
 *
 * @property {number} stats.count - The total number of tokens.
 * @property {number} stats.unique - The number of unique tokens.
 * @property {Object} stats.frequency - An object with token-frequency pairs, sorted by frequency in descending order.
 * @property {Object} stats.positions - An object with token-position pairs, where positions is an array of the indices of the token in the input string or array.
 * @property {Array<number>} stats.tokens - The array of tokens passed to the function.
 */
function tokenStats(input) {
    let tokens
    if (typeof input === 'string') {
        // Encode the string into tokens
        tokens = encode(input)
    } else {
        tokens = input
    }

    const stats = {
        count: tokens.length,
        unique: new Set(tokens).size,
        frequency: {},
        positions: {},
        tokens,
    }

    // Compute the frequency of each token
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (stats.frequency[token]) {
            stats.frequency[token]++;
            stats.positions[token].push(i);
        } else {
            stats.frequency[token] = 1;
            stats.positions[token] = [i];
        }
    }


    // Sort the frequency object by frequency in descending order
    stats.frequency = Object.fromEntries(
        Object.entries(stats.frequency)
            .sort((a, b) => b[1] - a[1])
    )

    return stats
}


/**
 *  This function works by iterating through the matches of the pat pattern in the input text,
 *  encoding each match using the encodeStr function and the byte_encoder mapping,
 *  and then applying the bpe function to the encoded token. The number of tokens produced by the bpe function is then added to the count variable.
 *  Finally, the count variable is returned as the result.
 * @param text
 * @return {number}
 */
function countTokens(text) {
    let count = 0
    const matches = Array.from(text.matchAll(pat)).map(x => x[0])

    // Timings for 20* chars(200000):  counting took average: 572.8,
    //     count = matches.reduce((acc, token) => {
    //         token = encodeStr(token).map(x => {
    //             return byte_encoder[x]
    //         }).join('');
    //
    //         return acc + bpe(token).split(' ').length;
    //     }, 0);

    //Timings for 20* chars(200000):  counting took average: 570.8,
    // for (let token of matches) {

    // Timings for 20* chars(200000):  counting took average: 559.85,
    // not much difrence. but i dont mind the for loopl
    let i, token;
    for (i = 0; i < matches.length; i++) {
        token = matches[i];
        token = encodeStr(matches[i]).map(x => {
            return byte_encoder[x]
        }).join('')

        count += bpe(token).split(' ').length
    }
    return count
}

/**
 * Decodes a list of BPE tokens into a text string.
 *
 * @param {Array} tokens - The list of BPE tokens to be decoded.
 * @return {string} text - The decoded text string.
 */
function decode(tokens) {
    if (!tokens) {
        console.warn("No tokens to decode, returning empty string")
        return "";
    }
    let text = tokens.map(x => decoder[x]).join('')
    text = decodeStr(text.split('').map(x => byte_decoder[x]))
    return text
}

module.exports = {
    encode,
    decode,
    countTokens,
    tokenStats
};
