var IEntityMapper = require("./IEntityMapper");
var PostEntity = require("../entities/PostEntity");
var PostDTO = require("../dto/PostDTO");
var BlogCategoryDTO = require("../dto/BlogCategoryDTO");

class PostEntityMapper extends IEntityMapper {
  constructor(blogCategoryEntityMapper) {
    super();

    this.blogCategoryEntityMapper = blogCategoryEntityMapper;
  }

  map(postDTO) {
    if (!postDTO instanceof PostDTO) {
      throw new Error("The object is NOT a valid PostDTO");
    }

    var postEntity = new PostEntity(postDTO.uid);
    postEntity.title = postDTO.title;
    postEntity.intro = postDTO.intro;
    postEntity.text = postDTO.text;

    if (postDTO.blogCategory !== undefined) {
      postEntity.blogCategory = this.blogCategoryEntityMapper.map(postDTO.blogCategory);
    }

    return postEntity;
  }
}

module.exports = PostEntityMapper
