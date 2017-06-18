var async = require('async');

var IDeleteRoute = require("./IDeleteRoute");

class DeleteRoute extends IDeleteRoute {
  constructor(repository, uidValidator) {
    super();

    this.repository = repository;
    this.uidValidator = uidValidator;
  }

  use(req, res, next) {
    try {
      var params = this.uidValidator.validate(req.params);
      var uid = params.uid;
    } catch (err) {
      return next(err);
    }

    async.waterfall([
      (cb) => {
        this.repository.remove(uid).then(() => {
          cb();
        }, err => {
          cb(err);
        });
      }
    ], (err, dto) => {
      if (err) {
        var error = new Error(err);
        error.status = 500;
        return next(error);
      }

      res.send({
        data: dto
      });
    });
  }
}

module.exports = DeleteRoute;
