const {encode, decode, countTokens, tokenStats} = require('./Encoder.js');
const crypto = require('crypto');

// Generate a random string of a given length
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}


test('empty string', () => {
    const str = "";
    expect(encode(str)).toEqual([])
    expect(decode(encode(str))).toEqual(str)
});

test('space', () => {
    const str = " ";
    expect(encode(str)).toEqual([220])
    expect(decode(encode(str))).toEqual(str)
});

test('tab', () => {
    const str = "\t";
    expect(encode(str)).toEqual([197])
    expect(decode(encode(str))).toEqual(str)
});

test('simple text', () => {
    const str = "This is some text";
    expect(encode(str)).toEqual([1212, 318, 617, 2420])
    expect(decode(encode(str))).toEqual(str)
});

test('multi-token word', () => {
    const str = "indivisible";
    expect(encode(str)).toEqual([521, 452, 12843])
    expect(decode(encode(str))).toEqual(str)
});

test('emojis', () => {
    const str = "hello 👋 world 🌍";
    expect(encode(str)).toEqual([31373, 50169, 233, 995, 12520, 234, 235])
    expect(decode(encode(str))).toEqual(str)
});

test('properties of Object', () => {
    const str = "toString constructor hasOwnProperty valueOf";

    expect(encode(str)).toEqual([1462, 10100, 23772, 468, 23858, 21746, 1988, 5189]);
    expect(decode(encode(str))).toEqual(str);
})

test('Random encode=decode count', () => {
    let n = 200
    let str

    let t = {
        c:0,e:0,d:0,l: 0,f:0
    }
    for (let i = 0; i < n; i++) {
        const randomNumber = Math.floor(Math.random() * (2 * n + 1)) + n;
        str = generateRandomString(randomNumber);
        t.l+= randomNumber;
        let now = Date.now()
        let _fe = encode(str);
        t.f += Date.now()-now; now = Date.now();
        let count = countTokens(str);
        t.c += Date.now()-now; now = Date.now();
        let e = encode(str);
        t.e += Date.now()-now; now = Date.now();
        let d = decode(e);
        t.d += Date.now()-now; now = Date.now();
        expect(d).toEqual(str);
        expect(e.length).toEqual(count);
    }
    console.log(`Timings for chars(${t.l}): fencode: ${t.f}, counting: ${t.c}, encoding: ${t.e}, decoding:${t.d}`)
})

test('empty encode', () => {
    expect(encode()).toEqual([]);
})

test('null encode', () => {
    expect(encode(null)).toEqual(encode("null"));
})

test('empty decode', () => {
    expect(decode()).toEqual("");
})

test('stats test', () => {
    const str = "hello 👋 world 🌍, im a foo your a foo, everwer where a foo foo";
    let e = encode(str);
    let stats = tokenStats(e);
    console.log("example stats: ", stats);
    expect(tokenStats(e)).toEqual(tokenStats(str))
    expect(decode(encode(str))).toEqual(str)
})

test('bench  count', () => {
    let n = 2
    let str

    let t = {
        c:0,e:0,d:0,l: 0,f:0
    }
    for (let i = 0; i < n; i++) {
        const randomNumber = 100000;
        str = generateRandomString(randomNumber);
        t.l+= randomNumber;
        let now = Date.now();
        let count = countTokens(str);

        let time = Date.now()-now;
        t.c += time;
        console.log("counted ", count, "in ", time);

    }
    console.log(`Timings for ${n}* chars(${str.length}):  counting took average: ${t.c / n}, `)
    expect(true)
})


test('test " issue #9', () => {
    const str = '“wrote jack a letter”'
    let e = encode(str);
    let stats = tokenStats(e);
    expect(e).toEqual([447, 250, 42910, 14509, 257, 3850, 447, 251])
    expect(decode(e)).toEqual(str)
})
