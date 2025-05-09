"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/bech32";
exports.ids = ["vendor-chunks/bech32"];
exports.modules = {

/***/ "(ssr)/./node_modules/bech32/index.js":
/*!**************************************!*\
  !*** ./node_modules/bech32/index.js ***!
  \**************************************/
/***/ ((module) => {

eval("\nvar ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'\n\n// pre-compute lookup table\nvar ALPHABET_MAP = {}\nfor (var z = 0; z < ALPHABET.length; z++) {\n  var x = ALPHABET.charAt(z)\n\n  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')\n  ALPHABET_MAP[x] = z\n}\n\nfunction polymodStep (pre) {\n  var b = pre >> 25\n  return ((pre & 0x1FFFFFF) << 5) ^\n    (-((b >> 0) & 1) & 0x3b6a57b2) ^\n    (-((b >> 1) & 1) & 0x26508e6d) ^\n    (-((b >> 2) & 1) & 0x1ea119fa) ^\n    (-((b >> 3) & 1) & 0x3d4233dd) ^\n    (-((b >> 4) & 1) & 0x2a1462b3)\n}\n\nfunction prefixChk (prefix) {\n  var chk = 1\n  for (var i = 0; i < prefix.length; ++i) {\n    var c = prefix.charCodeAt(i)\n    if (c < 33 || c > 126) return 'Invalid prefix (' + prefix + ')'\n\n    chk = polymodStep(chk) ^ (c >> 5)\n  }\n  chk = polymodStep(chk)\n\n  for (i = 0; i < prefix.length; ++i) {\n    var v = prefix.charCodeAt(i)\n    chk = polymodStep(chk) ^ (v & 0x1f)\n  }\n  return chk\n}\n\nfunction encode (prefix, words, LIMIT) {\n  LIMIT = LIMIT || 90\n  if ((prefix.length + 7 + words.length) > LIMIT) throw new TypeError('Exceeds length limit')\n\n  prefix = prefix.toLowerCase()\n\n  // determine chk mod\n  var chk = prefixChk(prefix)\n  if (typeof chk === 'string') throw new Error(chk)\n\n  var result = prefix + '1'\n  for (var i = 0; i < words.length; ++i) {\n    var x = words[i]\n    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')\n\n    chk = polymodStep(chk) ^ x\n    result += ALPHABET.charAt(x)\n  }\n\n  for (i = 0; i < 6; ++i) {\n    chk = polymodStep(chk)\n  }\n  chk ^= 1\n\n  for (i = 0; i < 6; ++i) {\n    var v = (chk >> ((5 - i) * 5)) & 0x1f\n    result += ALPHABET.charAt(v)\n  }\n\n  return result\n}\n\nfunction __decode (str, LIMIT) {\n  LIMIT = LIMIT || 90\n  if (str.length < 8) return str + ' too short'\n  if (str.length > LIMIT) return 'Exceeds length limit'\n\n  // don't allow mixed case\n  var lowered = str.toLowerCase()\n  var uppered = str.toUpperCase()\n  if (str !== lowered && str !== uppered) return 'Mixed-case string ' + str\n  str = lowered\n\n  var split = str.lastIndexOf('1')\n  if (split === -1) return 'No separator character for ' + str\n  if (split === 0) return 'Missing prefix for ' + str\n\n  var prefix = str.slice(0, split)\n  var wordChars = str.slice(split + 1)\n  if (wordChars.length < 6) return 'Data too short'\n\n  var chk = prefixChk(prefix)\n  if (typeof chk === 'string') return chk\n\n  var words = []\n  for (var i = 0; i < wordChars.length; ++i) {\n    var c = wordChars.charAt(i)\n    var v = ALPHABET_MAP[c]\n    if (v === undefined) return 'Unknown character ' + c\n    chk = polymodStep(chk) ^ v\n\n    // not in the checksum?\n    if (i + 6 >= wordChars.length) continue\n    words.push(v)\n  }\n\n  if (chk !== 1) return 'Invalid checksum for ' + str\n  return { prefix: prefix, words: words }\n}\n\nfunction decodeUnsafe () {\n  var res = __decode.apply(null, arguments)\n  if (typeof res === 'object') return res\n}\n\nfunction decode (str) {\n  var res = __decode.apply(null, arguments)\n  if (typeof res === 'object') return res\n\n  throw new Error(res)\n}\n\nfunction convert (data, inBits, outBits, pad) {\n  var value = 0\n  var bits = 0\n  var maxV = (1 << outBits) - 1\n\n  var result = []\n  for (var i = 0; i < data.length; ++i) {\n    value = (value << inBits) | data[i]\n    bits += inBits\n\n    while (bits >= outBits) {\n      bits -= outBits\n      result.push((value >> bits) & maxV)\n    }\n  }\n\n  if (pad) {\n    if (bits > 0) {\n      result.push((value << (outBits - bits)) & maxV)\n    }\n  } else {\n    if (bits >= inBits) return 'Excess padding'\n    if ((value << (outBits - bits)) & maxV) return 'Non-zero padding'\n  }\n\n  return result\n}\n\nfunction toWordsUnsafe (bytes) {\n  var res = convert(bytes, 8, 5, true)\n  if (Array.isArray(res)) return res\n}\n\nfunction toWords (bytes) {\n  var res = convert(bytes, 8, 5, true)\n  if (Array.isArray(res)) return res\n\n  throw new Error(res)\n}\n\nfunction fromWordsUnsafe (words) {\n  var res = convert(words, 5, 8, false)\n  if (Array.isArray(res)) return res\n}\n\nfunction fromWords (words) {\n  var res = convert(words, 5, 8, false)\n  if (Array.isArray(res)) return res\n\n  throw new Error(res)\n}\n\nmodule.exports = {\n  decodeUnsafe: decodeUnsafe,\n  decode: decode,\n  encode: encode,\n  toWordsUnsafe: toWordsUnsafe,\n  toWords: toWords,\n  fromWordsUnsafe: fromWordsUnsafe,\n  fromWords: fromWords\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYmVjaDMyL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixxQkFBcUI7QUFDckM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLG1CQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGNBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0E7O0FBRUEsY0FBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2FhLXNkay1kZW1vLy4vbm9kZV9tb2R1bGVzL2JlY2gzMi9pbmRleC5qcz82NWE0Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xudmFyIEFMUEhBQkVUID0gJ3FwenJ5OXg4Z2YydHZkdzBzM2puNTRraGNlNm11YTdsJ1xuXG4vLyBwcmUtY29tcHV0ZSBsb29rdXAgdGFibGVcbnZhciBBTFBIQUJFVF9NQVAgPSB7fVxuZm9yICh2YXIgeiA9IDA7IHogPCBBTFBIQUJFVC5sZW5ndGg7IHorKykge1xuICB2YXIgeCA9IEFMUEhBQkVULmNoYXJBdCh6KVxuXG4gIGlmIChBTFBIQUJFVF9NQVBbeF0gIT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IFR5cGVFcnJvcih4ICsgJyBpcyBhbWJpZ3VvdXMnKVxuICBBTFBIQUJFVF9NQVBbeF0gPSB6XG59XG5cbmZ1bmN0aW9uIHBvbHltb2RTdGVwIChwcmUpIHtcbiAgdmFyIGIgPSBwcmUgPj4gMjVcbiAgcmV0dXJuICgocHJlICYgMHgxRkZGRkZGKSA8PCA1KSBeXG4gICAgKC0oKGIgPj4gMCkgJiAxKSAmIDB4M2I2YTU3YjIpIF5cbiAgICAoLSgoYiA+PiAxKSAmIDEpICYgMHgyNjUwOGU2ZCkgXlxuICAgICgtKChiID4+IDIpICYgMSkgJiAweDFlYTExOWZhKSBeXG4gICAgKC0oKGIgPj4gMykgJiAxKSAmIDB4M2Q0MjMzZGQpIF5cbiAgICAoLSgoYiA+PiA0KSAmIDEpICYgMHgyYTE0NjJiMylcbn1cblxuZnVuY3Rpb24gcHJlZml4Q2hrIChwcmVmaXgpIHtcbiAgdmFyIGNoayA9IDFcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXgubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYyA9IHByZWZpeC5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGMgPCAzMyB8fCBjID4gMTI2KSByZXR1cm4gJ0ludmFsaWQgcHJlZml4ICgnICsgcHJlZml4ICsgJyknXG5cbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspIF4gKGMgPj4gNSlcbiAgfVxuICBjaGsgPSBwb2x5bW9kU3RlcChjaGspXG5cbiAgZm9yIChpID0gMDsgaSA8IHByZWZpeC5sZW5ndGg7ICsraSkge1xuICAgIHZhciB2ID0gcHJlZml4LmNoYXJDb2RlQXQoaSlcbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspIF4gKHYgJiAweDFmKVxuICB9XG4gIHJldHVybiBjaGtcbn1cblxuZnVuY3Rpb24gZW5jb2RlIChwcmVmaXgsIHdvcmRzLCBMSU1JVCkge1xuICBMSU1JVCA9IExJTUlUIHx8IDkwXG4gIGlmICgocHJlZml4Lmxlbmd0aCArIDcgKyB3b3Jkcy5sZW5ndGgpID4gTElNSVQpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4Y2VlZHMgbGVuZ3RoIGxpbWl0JylcblxuICBwcmVmaXggPSBwcmVmaXgudG9Mb3dlckNhc2UoKVxuXG4gIC8vIGRldGVybWluZSBjaGsgbW9kXG4gIHZhciBjaGsgPSBwcmVmaXhDaGsocHJlZml4KVxuICBpZiAodHlwZW9mIGNoayA9PT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcihjaGspXG5cbiAgdmFyIHJlc3VsdCA9IHByZWZpeCArICcxJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHggPSB3b3Jkc1tpXVxuICAgIGlmICgoeCA+PiA1KSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdOb24gNS1iaXQgd29yZCcpXG5cbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspIF4geFxuICAgIHJlc3VsdCArPSBBTFBIQUJFVC5jaGFyQXQoeClcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspXG4gIH1cbiAgY2hrIF49IDFcblxuICBmb3IgKGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgdmFyIHYgPSAoY2hrID4+ICgoNSAtIGkpICogNSkpICYgMHgxZlxuICAgIHJlc3VsdCArPSBBTFBIQUJFVC5jaGFyQXQodilcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gX19kZWNvZGUgKHN0ciwgTElNSVQpIHtcbiAgTElNSVQgPSBMSU1JVCB8fCA5MFxuICBpZiAoc3RyLmxlbmd0aCA8IDgpIHJldHVybiBzdHIgKyAnIHRvbyBzaG9ydCdcbiAgaWYgKHN0ci5sZW5ndGggPiBMSU1JVCkgcmV0dXJuICdFeGNlZWRzIGxlbmd0aCBsaW1pdCdcblxuICAvLyBkb24ndCBhbGxvdyBtaXhlZCBjYXNlXG4gIHZhciBsb3dlcmVkID0gc3RyLnRvTG93ZXJDYXNlKClcbiAgdmFyIHVwcGVyZWQgPSBzdHIudG9VcHBlckNhc2UoKVxuICBpZiAoc3RyICE9PSBsb3dlcmVkICYmIHN0ciAhPT0gdXBwZXJlZCkgcmV0dXJuICdNaXhlZC1jYXNlIHN0cmluZyAnICsgc3RyXG4gIHN0ciA9IGxvd2VyZWRcblxuICB2YXIgc3BsaXQgPSBzdHIubGFzdEluZGV4T2YoJzEnKVxuICBpZiAoc3BsaXQgPT09IC0xKSByZXR1cm4gJ05vIHNlcGFyYXRvciBjaGFyYWN0ZXIgZm9yICcgKyBzdHJcbiAgaWYgKHNwbGl0ID09PSAwKSByZXR1cm4gJ01pc3NpbmcgcHJlZml4IGZvciAnICsgc3RyXG5cbiAgdmFyIHByZWZpeCA9IHN0ci5zbGljZSgwLCBzcGxpdClcbiAgdmFyIHdvcmRDaGFycyA9IHN0ci5zbGljZShzcGxpdCArIDEpXG4gIGlmICh3b3JkQ2hhcnMubGVuZ3RoIDwgNikgcmV0dXJuICdEYXRhIHRvbyBzaG9ydCdcblxuICB2YXIgY2hrID0gcHJlZml4Q2hrKHByZWZpeClcbiAgaWYgKHR5cGVvZiBjaGsgPT09ICdzdHJpbmcnKSByZXR1cm4gY2hrXG5cbiAgdmFyIHdvcmRzID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3JkQ2hhcnMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYyA9IHdvcmRDaGFycy5jaGFyQXQoaSlcbiAgICB2YXIgdiA9IEFMUEhBQkVUX01BUFtjXVxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHJldHVybiAnVW5rbm93biBjaGFyYWN0ZXIgJyArIGNcbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspIF4gdlxuXG4gICAgLy8gbm90IGluIHRoZSBjaGVja3N1bT9cbiAgICBpZiAoaSArIDYgPj0gd29yZENoYXJzLmxlbmd0aCkgY29udGludWVcbiAgICB3b3Jkcy5wdXNoKHYpXG4gIH1cblxuICBpZiAoY2hrICE9PSAxKSByZXR1cm4gJ0ludmFsaWQgY2hlY2tzdW0gZm9yICcgKyBzdHJcbiAgcmV0dXJuIHsgcHJlZml4OiBwcmVmaXgsIHdvcmRzOiB3b3JkcyB9XG59XG5cbmZ1bmN0aW9uIGRlY29kZVVuc2FmZSAoKSB7XG4gIHZhciByZXMgPSBfX2RlY29kZS5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0JykgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBkZWNvZGUgKHN0cikge1xuICB2YXIgcmVzID0gX19kZWNvZGUuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHJldHVybiByZXNcblxuICB0aHJvdyBuZXcgRXJyb3IocmVzKVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0IChkYXRhLCBpbkJpdHMsIG91dEJpdHMsIHBhZCkge1xuICB2YXIgdmFsdWUgPSAwXG4gIHZhciBiaXRzID0gMFxuICB2YXIgbWF4ViA9ICgxIDw8IG91dEJpdHMpIC0gMVxuXG4gIHZhciByZXN1bHQgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICB2YWx1ZSA9ICh2YWx1ZSA8PCBpbkJpdHMpIHwgZGF0YVtpXVxuICAgIGJpdHMgKz0gaW5CaXRzXG5cbiAgICB3aGlsZSAoYml0cyA+PSBvdXRCaXRzKSB7XG4gICAgICBiaXRzIC09IG91dEJpdHNcbiAgICAgIHJlc3VsdC5wdXNoKCh2YWx1ZSA+PiBiaXRzKSAmIG1heFYpXG4gICAgfVxuICB9XG5cbiAgaWYgKHBhZCkge1xuICAgIGlmIChiaXRzID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2goKHZhbHVlIDw8IChvdXRCaXRzIC0gYml0cykpICYgbWF4VilcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJpdHMgPj0gaW5CaXRzKSByZXR1cm4gJ0V4Y2VzcyBwYWRkaW5nJ1xuICAgIGlmICgodmFsdWUgPDwgKG91dEJpdHMgLSBiaXRzKSkgJiBtYXhWKSByZXR1cm4gJ05vbi16ZXJvIHBhZGRpbmcnXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIHRvV29yZHNVbnNhZmUgKGJ5dGVzKSB7XG4gIHZhciByZXMgPSBjb252ZXJ0KGJ5dGVzLCA4LCA1LCB0cnVlKVxuICBpZiAoQXJyYXkuaXNBcnJheShyZXMpKSByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHRvV29yZHMgKGJ5dGVzKSB7XG4gIHZhciByZXMgPSBjb252ZXJ0KGJ5dGVzLCA4LCA1LCB0cnVlKVxuICBpZiAoQXJyYXkuaXNBcnJheShyZXMpKSByZXR1cm4gcmVzXG5cbiAgdGhyb3cgbmV3IEVycm9yKHJlcylcbn1cblxuZnVuY3Rpb24gZnJvbVdvcmRzVW5zYWZlICh3b3Jkcykge1xuICB2YXIgcmVzID0gY29udmVydCh3b3JkcywgNSwgOCwgZmFsc2UpXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZnJvbVdvcmRzICh3b3Jkcykge1xuICB2YXIgcmVzID0gY29udmVydCh3b3JkcywgNSwgOCwgZmFsc2UpXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHJldHVybiByZXNcblxuICB0aHJvdyBuZXcgRXJyb3IocmVzKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVjb2RlVW5zYWZlOiBkZWNvZGVVbnNhZmUsXG4gIGRlY29kZTogZGVjb2RlLFxuICBlbmNvZGU6IGVuY29kZSxcbiAgdG9Xb3Jkc1Vuc2FmZTogdG9Xb3Jkc1Vuc2FmZSxcbiAgdG9Xb3JkczogdG9Xb3JkcyxcbiAgZnJvbVdvcmRzVW5zYWZlOiBmcm9tV29yZHNVbnNhZmUsXG4gIGZyb21Xb3JkczogZnJvbVdvcmRzXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/bech32/index.js\n");

/***/ })

};
;