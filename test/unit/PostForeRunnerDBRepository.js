var assert = require("assert");
var config = require("config");

var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();
var db = fdb.db("BlogDB");

var UID = require("../../lib/uid/UID");
var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var PostEntity = require("../../entities/PostEntity");
var BlogCategoryForeRunnerDBRepository = require("../../repositories/ForeRunnerDB/BlogCategoryForeRunnerDBRepository");
var PostForeRunnerDBRepository = require("../../repositories/ForeRunnerDB/PostForeRunnerDBRepository");

var newPostTitle = "AngularJs 2 proxy object wrapper";

suite('PostForeRunnerDBRepository test', function () {
  before(function () {

  });

  test("Should create a new PostEntity object", function (done) {
    this.blogCategoryRepository = new BlogCategoryForeRunnerDBRepository(db);

    this.blogCategory = new BlogCategoryEntity(UID.create());
    this.blogCategory.name = "Javascript";

    this.blogCategoryRepository.add(this.blogCategory).then(() => {
      this.postRepository = new PostForeRunnerDBRepository(db, this.blogCategoryRepository);

      this.post = new PostEntity(UID.create());
      this.post.title = "Javascript proxy object";
      this.post.intro = "Object used to define custom behavior";
      this.post.text = "The target is the object which the proxy virtualizes";
      this.post.blogCategory = this.blogCategory;

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should add a new PostEntity into PostForeRunnerDBRepository", function (done) {
    this.postRepository.add(this.post).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the PostEntity from PostForeRunnerDBRepository", function (done) {
    this.postRepository.getByUid(this.post.uid).then((post) => {
      assert(post instanceof PostEntity, "The repository post is NOT an instance of PostEntity");
      assert(post.uid === this.post.uid, "The post uid is NOT == " + this.post.uid + ", but:" + post.uid);
      assert(post.title === this.post.title, "The post title is NOT == '" + this.post.title + "', but:" + post.title);

      assert(post.blogCategory instanceof BlogCategoryEntity, "The repository post.blogCategory is NOT an instance of BlogCategoryEntity");
      assert(post.blogCategory.uid === this.post.blogCategory.uid, "The post.blogCategory.uid is NOT == " + this.post.blogCategory.uid + ", but:" + post.blogCategory.uid);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should update the PostEntity into PostForeRunnerDBRepository", function (done) {
    this.post.title = newPostTitle;

    this.postRepository.update({
      uid: this.post.uid
    }, this.post).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the PostEntity from PostForeRunnerDBRepository and check the new title", function (done) {
    this.postRepository.getByUid(this.post.uid).then((post) => {
      assert(post instanceof PostEntity, "The repository post is NOT an instance of PostEntity");
      assert(post.uid === this.post.uid, "The post id is NOT == " + this.post.uid + ", but:" + post.uid);
      assert(post.title === newPostTitle, "The post title is NOT == '" + newPostTitle + "', but:" + post.title);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should add a new PostEntity into PostForeRunnerDBRepository", function (done) {
    var post = new PostEntity(UID.create());
    post.title = "Javascript promise";
    post.intro = "The Promise object represents the eventual completion (or failure) of an asynchronous operation";
    post.text = "A Promise is a proxy for a value not necessarily known";
    post.blogCategory = this.blogCategory;

    this.postRepository.add(post).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the two PostEntity present in PostForeRunnerDBRepository", function (done) {
    this.postRepository.get().then((posts) => {
      assert(posts.length == 2, "The repository posts has NOT length 2, but:" + posts.length);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the PostEntity from PostForeRunnerDBRepository", function (done) {
    this.postRepository.get({
      uid: this.post.uid
    }).then((posts) => {
      assert(posts.length == 1, "The repository posts has NOT length 1, but:" + posts.length);

      assert(posts[0] instanceof PostEntity, "The repository posts[0] is NOT an instance of PostEntity");
      assert(posts[0].uid === this.post.uid, "The posts[0] id is NOT == " + this.post.uid + ", but:" + posts[0].id);
      assert(posts[0].title === newPostTitle, "The posts[0] title is NOT == '" + newPostTitle + "', but:" + posts[0].title);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should remove the PostEntity from PostForeRunnerDBRepository", function (done) {
    this.postRepository.remove({
      uid: this.post.uid
    }).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should NOT get the PostEntity from PostForeRunnerDBRepository", function (done) {
    this.postRepository.getByUid(this.post.uid).then((post) => {
      if (post === undefined) {
        return done();
      }

      throw new Error("PostEntity found into PostForeRunnerDBRepository");
    }, err => {
      throw new Error(err);
    });
  });

  after(function () {

  });
});
