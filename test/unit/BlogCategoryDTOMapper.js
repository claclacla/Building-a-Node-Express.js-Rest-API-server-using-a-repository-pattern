var assert = require("assert");

var UID = require("../../lib/uid/UID");
var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var BlogCategoryDTO = require("../../dto/BlogCategoryDTO");
var BlogCategoryDTOMapper = require("../../dtoMappers/BlogCategoryDTOMapper");

suite('BlogCategoryDTOMapper test', function () {
  before(function () {

  });

  test("Should create a new BlogCategoryDTOMapper", function (done) {
    var blogCategoryEntity = new BlogCategoryEntity(UID.create());
    blogCategoryEntity.name = "Javascript";

    var blogCategoryDTOMapper = new BlogCategoryDTOMapper();

    try {
      var blogCategory = blogCategoryDTOMapper.map(blogCategoryEntity);
    } catch (err) {
      throw new Error("BlogCategoryDTO NOT created");
    }

    assert(blogCategory instanceof BlogCategoryDTO, "blogCategory is NOT an instance of BlogCategoryDTO");

    done();
  });
});
