var IDTOMapper = require("./IDTOMapper");
var BlogCategoryEntity = require("../entities/BlogCategoryEntity");
var BlogCategoryDTO = require("../dto/BlogCategoryDTO");

class BlogCategoryDTOMapper extends IDTOMapper {
  constructor() {
    super();
  }

  map(blogCategoryEntity) {
    if (!blogCategoryEntity instanceof BlogCategoryEntity) {
      throw new Error("The object is NOT a valid BlogCategoryEntity");
    }

    var blogCategoryDTO = new BlogCategoryDTO(blogCategoryEntity.uid);
    blogCategoryDTO.name = blogCategoryEntity.name;

    return blogCategoryDTO;
  }
}

module.exports = BlogCategoryDTOMapper
