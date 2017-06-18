var shortid = require("shortid");

class UID {
  static create() {
    return shortid.generate();
  }

  static isValid(uid) {
    return shortid.isValid(uid);
  }
}

module.exports = UID
