/* eslint-disable no-console */

/**
 * * ### AFRILANG LEXER
 * #### NOTE:
 * * gsg
 * #### TODO:
 * * should make lexer ignore spaces
 * #### TODO:
 * * should make lexer ignore comments
 */
class Lexer {
  constructor(code) {
    // input source code character
    this.code = code;
    // lexer position
    this.line = 1;
    this.column = 1;
    this.lastPosition = -1;
    // identifiers
    this.identifierChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.numberChar = '1234567890';
    this.operator = '=+-><';
    this.separator = ',;{}[]()';
    this.keyWord = ['var', 'let', 'fun', 'const', 'if', 'else'];
  }

  /**
   * * consumes character at current position and increments
   * lastPosition and column
   * @return {string}
   * */
  eatChar() {
    this.column += 1;
    this.lastPosition += 1;
    return this.code.charAt(this.lastPosition);
  }

  /**
   * returns character at current location
   * @return {string || null}
   */
  peekChar() {
    // check if we have gotten to the last character in the
    // input source code
    return (this.lastPosition + 1 < this.code.length)
      ? this.code.charAt(this.lastPosition + 1)
      : null;
  }

  /**
   * check if we have gotten to the last character in
   * the input source code
   * @return {boolean}
   * */
  lastReached() {
    return (this.lastPosition + 1 >= this.code.length);
  }

  /**
   * check if characters in position are valid keywords or identifier
   * @return {object || null}
   * */
  identifyKeyword() {
    let char = '';

    // loop through source code characters and add them up
    // if there are valid identifierChar
    while (this.identifierChar.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    // check if added character is a valid inbuilt keyword
    if (this.keyWord.indexOf(char) > -1) {
      return {
        type: 'keyword',
        value: char,
      };
      // if it is not a keyword then it has to be an identifier (variable or function name)
    }
    if (char.length > 0) {
      return {
        type: 'identifier',
        value: char,
      };
    }

    return null;
    // this.eatChar();
  }

  /**
   * TODO: should probably throw an error if string is not enclosed in a quote or probably not
   * check if characters in position are valid string
   * @return {object || null}
   * */
  stringLiteral() {
    let char = '';

    // check if first character begins with quotes
    if (this.peekChar() === "'" || this.peekChar() === '"') {
      char += this.eatChar();

      // loop through source code characters and add them up
      // if they are enclosed in quotes
      while (this.peekChar() !== char[0]) {
        // used the below line to fix infinite loop, if the supposed
        // string doesnt have a closing quote
        if (this.lastReached() === true) throw new SyntaxError('invalide token');

        char += this.eatChar();
      }

      // check if string character ends with quote matching the first one
      if (this.peekChar() === char[0]) {
        char += this.eatChar();
      }
    } // else this.eatChar();

    if (char.length > 0) {
      return {
        type: 'stringLiteral',
        value: char,
      };
    }
    return null;
  }

  /**
   * checks if characters in position are valid integers
   * @return {object || null}
   * */
  numberLiteral() {
    let char = '';

    // if characters are valid numberLiterals continue consuming them
    while (this.numberChar.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    if (char.length > 0) {
      return {
        type: 'numberLiteral',
        value: char,
      };
    }

    return null;
  }

  /**
   * checks if characters are valid boolean literals
   * @return {object || null}
   * */
  booleanLiteral() {
    const {
      lastPosition,
      column,
      line,
    } = this;
    let char = '';

    // if characters are valid charliterals add them up
    while (this.identifierChar.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    // check if added values are boolean values
    if (char === 'true' || char === 'false') {
      return {
        type: 'booleanLiteral',
        value: char,
      };
    }
    this.revert(lastPosition, column, line);

    return null;
  }

  /**
   * checks if characters in position are valid operators
   * @return {object || null}
   * */
  identifyOperator() {
    let char = '';

    // if characters are valid symbols, continue consuming
    while (this.operator.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    if (char.length > 0) {
      return {
        type: 'operator',
        value: char,
      };
    }

    return null;
  }

  /**
   *
   * */
  identifySeparator() {
    let char = '';

    // if characters are valid separators, continue consuming
    if (this.separator.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    if (char.length > 0) {
      return {
        type: 'separator',
        value: char,
      };
    }

    return null;
  }

  /**
   * checks if character in postion are newlines
   * @return {object || null}
   * */
  identifyNewline() {
    let char = '';

    if (this.peekChar() === '\n') {
      char += this.eatChar();
      this.line += 1;

      return {
        type: 'newline',
        value: char,
      };
    }

    return null;
  }

  /**
   * checks if character in position are whitespaces
   * @return {object || null}
   * */
  space() {
    let char = '';

    while (this.peekChar() === ' ') {
      char += this.eatChar();
    }

    if (char.length > 0) {
      return {
        type: 'space',
        value: char,
      };
    }

    return null;
  }

  /**
   * * check if characters are single line comments
   *  @return {object || null}
   */
  identifySingleLineComment() {
    let chars = '';

    if (this.code.charAt(this.lastPosition + 1) === '/'
      && this.code.charAt(this.lastPosition + 2 === '/')) {
      chars += this.eatChar();
      chars += this.eatChar();

      while (this.peekChar() !== '\n') {
        chars += this.eatChar();
      }
    }

    if (chars.length > 0) {
      return {
        type: 'singleLineComment',
        value: chars,
      };
    }
    return null;
  }


  /**
   * reverts code position to previous state if lexing fails
   *
   * */
  revert(lastPosition, column, line) {
    this.lastPosition = lastPosition;
    this.column = column;
    this.line = line;
  }

  lex() {
    const token = [];

    while (this.lastReached() !== true) {
      // console.log(this.lastPosition+1);
      const temp = this.booleanLiteral()
        || this.identifyKeyword()
        || this.stringLiteral()
        || this.identifyOperator()
        || this.identifySeparator()
        || this.identifySingleLineComment()
        || this.space()
        || this.numberLiteral()
        || this.identifyNewline();

      if (temp) {
        if (temp.type !== 'space' && temp.type !== 'newline') {
          token.push(temp);
        }
      }
    }

    return token;
  }
}
console.time('lex');
const code = 'fun main(a,b){print(\'hello world\')}//heygd \n';
const lex = new Lexer(code);
console.log(lex.lex());
console.timeEnd('lex');
