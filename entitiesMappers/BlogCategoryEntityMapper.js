var IEntityMapper = require("./IEntityMapper");
var BlogCategoryEntity = require("../entities/BlogCategoryEntity");
var BlogCategoryDTO = require("../dto/BlogCategoryDTO");

class BlogCategoryEntityMapper extends IEntityMapper {
  constructor() {
    super();
  }

  map(blogCategoryDTO) {
    if (!blogCategoryDTO instanceof BlogCategoryDTO) {
      throw new Error("The object is NOT a valid BlogCategoryDTO");
    }

    var blogCategoryEntity = new BlogCategoryEntity(blogCategoryDTO.uid);
    blogCategoryEntity.name = blogCategoryDTO.name;

    return blogCategoryEntity;
  }
}

module.exports = BlogCategoryEntityMapper
