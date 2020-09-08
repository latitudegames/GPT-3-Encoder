const {encode, decode} = require('./Encoder.js');

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