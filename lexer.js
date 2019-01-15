
/** TODO: should make lexer ignore spaces
 * TODO: should make lexer igonre comments
 * TODO: should make lexer increment line variable when it encounters a newline
**/
class lexer {
  constructor(code) {
    //input source code character
    this.code = code;
    //lexer position
    this.column = 0;
    this.lastPosition = -1;
    //identifiers
    this.identifierChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.operator = '=;+-><';
    this.keyWord = ['var', 'let', 'const', 'if', 'else'];
    this.numberLiteral = '1234567890';

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

    //check if added character is a valid inbuilt keyword
    if (this.keyWord.indexOf(char) > -1) {
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
  identifyStringLiteral() {
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
  identifyNumberLiteral() {
    let char = "";
    
    //if characters are valid numberLiterals continue consuming them
    while (this.numberLiteral.indexOf(this.peekChar()) > -1) {
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

  test() {
    let token = [];
    while (this.lastReached() !== true) {
      const temp = this.identifyKeyword() ||
        this.identifyStringLiteral() ||
        this.identifyOperator() ||
        this.space() ||
        this.identifyNumberLiteral();

      //console.log(temp);

      if (temp !== null) token.push(temp);
    }

    return token;
  }

}
console.time('lex')
const code = `var str = "hey43+jhdh;\n var num = 32;"`;
const lex = new lexer(code);
console.log(lex.test());
console.timeEnd('lex')
