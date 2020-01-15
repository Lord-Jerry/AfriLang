const Lexer = require('./lexer');
const Parser = require('./parser');

// example source code
const code = `
fun main() {
  let a  = 12;
}
`;

console.time('lex');

const tokens = new Lexer(code).lex();
new Parser(tokens).parse();

console.timeEnd('lex');
