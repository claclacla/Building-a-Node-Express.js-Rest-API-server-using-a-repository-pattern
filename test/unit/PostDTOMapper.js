var assert = require("assert");

var UID = require("../../lib/uid/UID");
var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var PostEntity = require("../../entities/PostEntity");
var BlogCategoryDTO = require("../../dto/BlogCategoryDTO");
var PostDTO = require("../../dto/PostDTO");
var PostDTOMapper = require("../../dtoMappers/PostDTOMapper");
var BlogCategoryDTOMapper = require("../../dtoMappers/BlogCategoryDTOMapper");

suite('PostDTOMapper test', function () {
  before(function () {

  });

  test("Should create a new PostDTOMapper", function (done) {
    var blogCategoryEntity = new BlogCategoryEntity(UID.create());
    blogCategoryEntity.name = "Javascript";

    var postEntity = new PostEntity(UID.create());
    postEntity.title = "Javascript proxy object";
    postEntity.intro = "Object used to define custom behavior";
    postEntity.text = "The target is the object which the proxy virtualizes";
    postEntity.blogCategory = blogCategoryEntity;

    var postDTOMapper = new PostDTOMapper(new BlogCategoryDTOMapper());

    try {
      var post = postDTOMapper.map(postEntity);
    } catch (err) {
      throw new Error("PostDTOMapper NOT created");
    }

    assert(post instanceof PostDTO, "post is NOT an instance of PostDTO");

    done();
  });
});
