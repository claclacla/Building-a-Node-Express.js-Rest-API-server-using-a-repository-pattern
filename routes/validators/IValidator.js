class IValidator {
  constructor() {
    if (this.validate === undefined) {
      throw new TypeError("Must override .validate() method");
    }
  }
}

module.exports = IValidator
