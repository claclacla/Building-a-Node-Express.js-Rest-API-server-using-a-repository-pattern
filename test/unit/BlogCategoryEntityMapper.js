var assert = require("assert");

var UID = require("../../lib/uid/UID");
var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var BlogCategoryDTO = require("../../dto/BlogCategoryDTO");
var BlogCategoryEntityMapper = require("../../entitiesMappers/BlogCategoryEntityMapper");

suite('BlogCategoryEntityMapper test', function () {
  before(function () {

  });

  test("Should create a new BlogCategoryEntityMapper", function (done) {
    var blogCategoryDTO = new BlogCategoryDTO(UID.create());
    blogCategoryDTO.name = "Javascript";

    var blogCategoryEntityMapper = new BlogCategoryEntityMapper();

    try {
      var blogCategoryEntity = blogCategoryEntityMapper.map(blogCategoryDTO);
    } catch (err) {
      throw new Error("BlogCategoryEntity NOT created");
    }

    assert(blogCategoryEntity instanceof BlogCategoryEntity, "blogCategory is NOT an instance of BlogCategoryEntity");

    done();
  });
});
