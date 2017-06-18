var UID = require("../../lib/uid/UID");
var IValidator = require("./IValidator");

class QueryParamsValidator extends IValidator {
  constructor(queryFilters) {
    super();

    this.QUERY_PARAM_Q = "q";
    this.QUERY_PARAM_SKIP = "skip";
    this.QUERY_PARAM_LIMIT = "limit";
    this.QUERY_PARAM_SORT = "sort";

    this.QUERY_PARAMS = [
      this.QUERY_PARAM_SKIP,
      this.QUERY_PARAM_LIMIT,
      this.QUERY_PARAM_SORT
    ];
  }

  validate(query) {
    var queryParams = {};

    Object.keys(query).forEach(key => {
      if (this.QUERY_PARAMS.indexOf(key) < 0 && key !== this.QUERY_PARAM_Q) {
        var error = new Error("No valid query parameter found with key: " + key);
        error.status = 500;
        throw error;
      }

      if ([this.QUERY_PARAM_SKIP, this.QUERY_PARAM_LIMIT].indexOf(key) >= 0) {
        if (isNaN(parseInt(query[key]))) {
          var error = new Error("No valid " + key + " value: " + query[key]);
          error.status = 500;
          throw error;
        }
      }

      if (key === this.QUERY_PARAM_Q) {
        try {
          queryParams.q = JSON.parse(query[key]);
        } catch (err) {
          throw new Error("No valid query parameter 'q' string");
        }
      } else {
        if (queryParams.filters === undefined) {
          queryParams.filters = {};
        }

        if (key === this.QUERY_PARAM_SORT) {
          try {
            queryParams.filters[key] = JSON.parse(query[key]);
          } catch (err) {
            throw new Error("No valid query parameter '" + key + "' string");
          }
        } else {
          queryParams.filters[key] = query[key];
        }
      }
    });

    return queryParams;
  }
}

module.exports = QueryParamsValidator;
