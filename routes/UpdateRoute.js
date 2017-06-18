var async = require('async');

var IUpdateRoute = require("./IUpdateRoute");

class UpdateRoute extends IUpdateRoute {
  constructor(repository, dTOMapper, entityMapper, uidValidator, dTOBodyValidator) {
    super();

    this.repository = repository;
    this.uidValidator = uidValidator;
    this.dTOMapper = dTOMapper;
    this.entityMapper = entityMapper;
    this.dTOBodyValidator = dTOBodyValidator;
  }

  use(req, res, next) {
    try {
      var params = this.uidValidator.validate(req.params);
      var uid = params.uid;
    } catch (err) {
      return next(err);
    }

    try {
      var dto = this.dTOBodyValidator.validate(req.body);
    } catch (err) {
      return next(err);
    }

    async.waterfall([
      (cb) => { // Update blog category
        var entity = this.entityMapper.map(dto);

        this.repository.update({
          uid: uid
        }, entity).then(() => {
          cb();
        }, err => {
          cb(err);
        });
      },
      (cb) => { // Get blog category
        this.repository.getByUid(uid).then((entity) => {
          var dto = this.dTOMapper.map(entity);

          cb(null, dto);
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

      res.status(200).send({
        data: dto
      });
    });
  }
}

module.exports = UpdateRoute;
