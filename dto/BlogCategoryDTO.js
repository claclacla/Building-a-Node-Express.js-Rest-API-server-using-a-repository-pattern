var IDTO = require("./IDTO");

class BlogCategoryDTO extends IDTO {
  constructor(uid) {
    super(uid);

    this.name = "";
  }
}

module.exports = BlogCategoryDTO
