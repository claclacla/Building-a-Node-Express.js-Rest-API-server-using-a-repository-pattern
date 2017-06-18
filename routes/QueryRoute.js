var async = require('async');

var IQueryRoute = require("./IQueryRoute");

class QueryRoute extends IQueryRoute {
  constructor(repository, dTOMapper, queryParamsValidator) {
    super();

    this.repository = repository;
    this.dTOMapper = dTOMapper;
    this.queryParamsValidator = queryParamsValidator;
  }

  use(req, res, next) {
    try {
      var queryParams = this.queryParamsValidator.validate(req.query);
    } catch (err) {
      return next(err);
    }

    async.waterfall([
      (cb) => { // Get blog category list
        this.repository.get(queryParams.q, queryParams.filters).then((entities) => {
          if (entities === undefined) {
            var err = new Error('Not Found');
            err.status = 404;
            return next(err);
          }

          var dto = null;
          var dtos = [];

          entities.forEach(entity => {
            dto = this.dTOMapper.map(entity);
            dtos.push(dto);
          });

          cb(null, dtos);
        }, err => {
          cb(err);
        });

      }
    ], (err, dtos) => {
      if (err) {
        var error = new Error(err);
        error.status = 500;
        return next(error);
      }

      res.send({
        data: dtos
      });
    });
  }
}

module.exports = QueryRoute;
