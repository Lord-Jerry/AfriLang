const Lexer = require('./lexer');
const Parser = require('./parser');

// example source code
const code = `
fun main() {
  let a  = 12;
}
`;

console.time('lex');
const lex = new Lexer(code);
console.log(lex.lex());
console.timeEnd('lex');
