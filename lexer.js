/** TODO: should make lexer ignore spaces
 * TODO: should make lexer igonre comments
**/
class lexer {
  constructor(code) {
    //input source code character
    this.code = code;
    //lexer position
    this.line = 1;
    this.column = 1;
    this.lastPosition = -1;
    //identifiers
    this.identifierChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.operator = '=;+-><';
    this.keyWord = ['var', 'let', 'const', 'if', 'else'];
    this.numberChar = '1234567890';

  }

  /**
   * consumes character at current position and increments
   * lastPosition and column
   * @return {string}
   **/
  eatChar() {
    this.column += 1;
    this.lastPosition += 1;
    return this.code.charAt(this.lastPosition);
  }

  /**
   * returns character at current location
   * @return {string || null}
   **/
  peekChar() {
    //check if we have gotten to the last character in the 
    // input source code
    return (this.lastPosition + 1 < this.code.length) ?
      this.code.charAt(this.lastPosition + 1) :
      null;
  }

  /**  
   * check if we have gotten to te last character in 
   * the input source code
   * @return {boolean}
   **/
  lastReached() {
    return (this.lastPosition + 1 >= this.code.length) ? true : false;

  }

  /**
   * check if characters in position are valid keywords or identifier
   * @return {object || null}
   **/
  identifyKeyword() {
    let char = "";

    //loop through source code characters and add them up 
    //if there are valid identifierChar
    while (this.identifierChar.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }
     //console.log(char,2)
    //check if added character is a valid inbuilt keyword
    if (this.keyWord.indexOf(char) > -1) {
      //console.log(char)
      return {
        type: 'keyword',
        value: char
      };
    //if it is not a keyword then it has to be an identifier (variable or function name)
    } else if (char.length > 0) {
      return {
        type: 'identifier',
        value: char
      }
    }

    return null;
    //this.eatChar();

  }

  /**
   * TODO: should probably throw an error if string is not enclosed in a quote or probably not
   * check if characters in position are valid string
   * @return {object || null}
   **/
  stringLiteral() {
    let char = "";

    //check if first character begins with quotes 
    if (this.peekChar() === "'" || this.peekChar() === '"') {
      char += this.eatChar();

      //loop through source code characters and add them up 
      //if they are enclosed in quotes
      while (this.peekChar() !== char[0]) {
         
        //used the below line to fix infinite loop, if the supposed
        //string doesnt have a closing quote 
        if (this.lastReached() === true) throw new SyntaxError('invalide token')

        char += this.eatChar();
      }

      //check if string character ends with quote matching the first one
      if (this.peekChar() === char[0]) {
        char += this.eatChar();
      }
    } //else this.eatChar();

    if (char.length > 0) {
      return {
        type: "stringLiteral",
        value: char
      };
    }
    return null;

  }
  
  /**
   * checks if characters in position are valid integers
   * @return{object || null}
  **/
  numberLiteral() {
    let char = "";
    
    //if characters are valid numberLiterals continue consuming them
    while (this.numberChar.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    if (char.length > 0) {
      return {
        type: 'numberLiteral',
        value: char
      }
    }

    return null;
  }

  /**
   * checks if characters are valid boolean literals 
   * @return{object || null}
  **/
  booleanLiteral() {
    const { lastPosition, column, line } = this;
    let char = '';

    //if characters are valid charliterals add them up
    while (this.identifierChar.indexOf(this.peekChar()) > -1) {
      char += this.eatChar()
    }

    //check if added values are boolean values
    if (char === 'true' || char === 'false') {
      return {
        type: 'booleanLiteral',
        value: char
      }
    }
    this.revert(lastPosition, column, line);

    return null;
  }
  
  /**
   * checks if characters in position are valid operators
   * @return{object || null}
  **/
  identifyOperator() {
    let char = "";

    //if characters are valid symbols, continue consuming
    while (this.operator.indexOf(this.peekChar()) > -1) {
      char += this.eatChar();
    }

    if (char.length > 0) {

      return {
        type: "operator",
        value: char
      }

    }

    return null;
  }

  /**
   * checks if character in postion are newlines
   * @return{object || null}
  **/
  identifyNewline() {
    let char = ''

    if (this.peekChar() === '\n') {
      char += this.eatChar();
      this.line += 1;

      return {
        type: 'newline',
        value: char
      }
    }

    return null
  }
  
  /**
   * checks if character in position are whitespaces
   * @return{object || null}
  **/
  space() {
    let char = ""
    while (this.peekChar() === ' ') {
      char += this.eatChar();
    }

    if (char.length > 0) {

      return {
        type: 'space',
        value: char
      }
    }

    return null;

  }

  /**
   * reverts code position to previous state if lexing fails
   *
  **/
  revert(lastPosition, column, line) {
    this.lastPosition = lastPosition;
    this.column = column;
    this.line = line;
  }

  test() {
    let token = [];

    while (this.lastReached() !== true) {
      //console.log(this.lastPosition+1);
      const temp = this.booleanLiteral() ||
        this.identifyKeyword() ||
        this.stringLiteral() ||
        this.identifyOperator() ||
        this.space() ||
        this.numberLiteral() ||
        this.identifyNewline();

      if (temp) {

        if (temp.type !== 'space' && temp.type !== 'newline'){
          token.push(temp);
        }

      }

    }

    return token;
  }

} 
console.time('lex')
const code = 'true var str = "hey43+jhdh" \n; \n\n\n var num = false;';
const lex = new lexer(code);
console.log(lex.test());
console.timeEnd('lex')
