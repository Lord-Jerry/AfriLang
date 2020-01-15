class Parser {
  constructor(token) {
    this.token = token;
    this.position= 0;
    this.ast = {};
  }

  /**
   * check if we yet to exceed token length
   */
  isBound() {
    return this.position <= this.token.length - 1;
  }

  peekToken() {
    return this.isBound() ? this.token[this.position] : null;
  }

  eatToken() {
    this.position += 1;
    return this.token[this.position - 1];
  }

  parse() {
    while (this.isBound()) {
      console.log(this.eatToken());
    }
  }
}

module.exports = Parser;
