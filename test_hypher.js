const Hypher = require('hypher');
const english = require('hyphenation.en-us');

// Override typography rules to force phonetics
english.leftmin = 1;
english.rightmin = 1;

const h = new Hypher(english);

console.log("baby: ", h.hyphenate("baby").join("·"));
console.log("pretty: ", h.hyphenate("pretty").join("·"));
console.log("someone: ", h.hyphenate("someone").join("·"));
console.log("travelled: ", h.hyphenate("travelled").join("·"));
