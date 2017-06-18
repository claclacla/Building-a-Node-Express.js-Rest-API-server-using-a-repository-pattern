var IEntity = require("./IEntity");

class BlogCategoryEntity extends IEntity {
  constructor(uid) {
    super(uid);

    this.name = "";
  }
}

module.exports = BlogCategoryEntity
