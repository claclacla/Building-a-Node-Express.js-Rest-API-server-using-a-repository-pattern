var assert = require("assert");

var UID = require("../../lib/uid/UID");
var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var PostEntity = require("../../entities/PostEntity");
var BlogCategoryDTO = require("../../dto/BlogCategoryDTO");
var PostDTO = require("../../dto/PostDTO");
var PostEntityMapper = require("../../entitiesMappers/PostEntityMapper");
var BlogCategoryEntityMapper = require("../../entitiesMappers/BlogCategoryEntityMapper");

suite('PostEntityMapper test', function () {
  before(function () {

  });

  test("Should create a new PostEntityMapper", function (done) {
    var blogCategoryDTO = new BlogCategoryDTO(UID.create());
    blogCategoryDTO.name = "Javascript";

    var postDTO = new PostDTO(UID.create());
    postDTO.title = "Javascript proxy object";
    postDTO.intro = "Object used to define custom behavior";
    postDTO.text = "The target is the object which the proxy virtualizes";
    postDTO.blogCategory = blogCategoryDTO;

    var postEntityMapper = new PostEntityMapper(new BlogCategoryEntityMapper());

    try {
      var post = postEntityMapper.map(postDTO);
    } catch (err) {
      throw new Error("PostEntityMapper NOT created");
    }

    assert(post instanceof PostEntity, "post is NOT an instance of PostEntity");

    done();
  });
});
