var IDTOMapper = require("./IDTOMapper");
var PostEntity = require("../entities/PostEntity");
var PostDTO = require("../dto/PostDTO");
var BlogCategoryEntity = require("../entities/BlogCategoryEntity");

class PostDTOMapper extends IDTOMapper {
  constructor(blogCategoryDTOMapper) {
    super();

    this.blogCategoryDTOMapper = blogCategoryDTOMapper;
  }

  map(postEntity) {
    if (!postEntity instanceof PostEntity) {
      throw new Error("The object is NOT a valid PostEntity");
    }

    var postDTO = new PostDTO(postEntity.uid);
    postDTO.title = postEntity.title;
    postDTO.intro = postEntity.intro;
    postDTO.text = postEntity.text;

    if (postEntity.blogCategory !== undefined) {
      postDTO.blogCategory = this.blogCategoryDTOMapper.map(postEntity.blogCategory);
    }

    return postDTO;
  }
}

module.exports = PostDTOMapper
