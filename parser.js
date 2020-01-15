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
}

module.exports = Parser;
