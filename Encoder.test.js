const {countTokens, encode, decode} = require('./Encoder.js');

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

test('properties of Object',()=>{
	const str = "toString constructor hasOwnProperty valueOf";

	expect(encode(str)).toEqual([1462, 10100, 23772, 468, 23858, 21746, 1988, 5189]);
	expect(decode(encode(str))).toEqual(str);
})

test('token count of string', () => {
  const str = 'This string should have 7 tokens.';
  expect(countTokens(str)).toEqual(7);
});