var IEntity = require("./IEntity");

class PostEntity extends IEntity {
  constructor(uid) {
    super(uid);

    this.title = "";
    this.intro = "";
    this.text = "";
  }
}

module.exports = PostEntity
