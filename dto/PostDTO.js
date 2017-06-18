var IDTO = require("./IDTO");

class PostDTO extends IDTO {
  constructor(uid) {
    super(uid);

    this.title = "";
    this.intro = "";
    this.text = "";
  }
}

module.exports = PostDTO
