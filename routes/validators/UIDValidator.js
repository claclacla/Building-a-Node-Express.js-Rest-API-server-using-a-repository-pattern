var UID = require("../../lib/uid/UID");
var IValidator = require("./IValidator");

class UIDValidator extends IValidator {
  constructor() {
    super();
  }

  validate(params) {
    if (!params.hasOwnProperty("uid") || !UID.isValid(params.uid)) {
      var error = new Error("No valid uid passed to URI");
      error.status = 500;
      throw error;
    }

    return params;
  }
}

module.exports = UIDValidator;
