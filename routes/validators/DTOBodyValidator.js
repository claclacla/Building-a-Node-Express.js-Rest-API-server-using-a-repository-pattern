var IValidator = require("./IValidator");

class DTOBodyValidator extends IValidator {
  constructor(dtoClass) {
    super();

    this.dtoClass = dtoClass;
  }

  validate(body) {
    if (!body instanceof Object || !body.hasOwnProperty("data")) {
      var error = new Error("The request body has NOT a valid format: {data: object}");
      error.status = 500;
      throw error;
    }

    var dto = body.data;

    if (!dto instanceof this.dtoClass) {
      var error = new Error("The request body.data is NOT valid");
      error.status = 500;
      throw error;
    }

    return dto;
  }
}

module.exports = DTOBodyValidator;
