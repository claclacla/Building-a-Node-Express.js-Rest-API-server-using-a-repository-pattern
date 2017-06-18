var assert = require("assert");
var config = require("config");

var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();
var db = fdb.db("BlogDB");

var blogCategoryName = "Javascript";
var newBlogCategoryName = "AngularJs 2";

var UID = require("../../lib/uid/UID");
var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var BlogCategoryForeRunnerDBRepository = require("../../repositories/ForeRunnerDB/BlogCategoryForeRunnerDBRepository");

suite('BlogCategoryForeRunnerDBRepository test', function () {
  before(function () {
    this.blogCategoryRepository = new BlogCategoryForeRunnerDBRepository(db);

    this.blogCategory = new BlogCategoryEntity(UID.create());
    this.blogCategory.name = blogCategoryName;
  });

  test("Should add a new BlogCategoryEntity into BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategoryRepository.add(this.blogCategory).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the BlogCategoryEntity from BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategoryRepository.getByUid(this.blogCategory.uid).then((blogCategory) => {
      assert(blogCategory instanceof BlogCategoryEntity, "The repository blogCategory is NOT an instance of BlogCategoryEntity");
      assert(blogCategory.uid === this.blogCategory.uid, "The blogCategory uid is NOT == " + this.blogCategory.uid + ", but:" + blogCategory.uid);
      assert(blogCategory.name === blogCategoryName, "The blogCategory name is NOT == '" + blogCategoryName + "', but:" + blogCategory.name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should update the BlogCategoryEntity into BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategory.name = newBlogCategoryName;

    this.blogCategoryRepository.update({
      uid: this.blogCategory.uid
    }, this.blogCategory).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the BlogCategoryEntity from BlogCategoryForeRunnerDBRepository and check the new name", function (done) {
    this.blogCategoryRepository.getByUid(this.blogCategory.uid).then((blogCategory) => {
      assert(blogCategory instanceof BlogCategoryEntity, "The repository blogCategory is NOT an instance of BlogCategoryEntity");
      assert(blogCategory.uid === this.blogCategory.uid, "The blogCategory id is NOT == " + this.blogCategory.uid + ", but:" + blogCategory.uid);
      assert(blogCategory.name === newBlogCategoryName, "The blogCategory name is NOT == '" + newBlogCategoryName + "', but:" + blogCategory.name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should add a new BlogCategoryEntity into BlogCategoryForeRunnerDBRepository", function (done) {
    var blogCategory = new BlogCategoryEntity(UID.create());
    blogCategory.name = blogCategoryName;

    this.blogCategoryRepository.add(blogCategory).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the two BlogCategoryEntity present in BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategoryRepository.get().then((blogCategories) => {
      assert(blogCategories.length == 2, "The repository blogCategories has NOT length 2, but:" + blogCategories.length);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the BlogCategoryEntity from BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategoryRepository.get({
      uid: this.blogCategory.uid
    }).then((blogCategories) => {
      assert(blogCategories.length == 1, "The repository blogCategories has NOT length 1, but:" + blogCategories.length);

      assert(blogCategories[0] instanceof BlogCategoryEntity, "The repository blogCategories[0] is NOT an instance of BlogCategoryEntity");
      assert(blogCategories[0].uid === this.blogCategory.uid, "The blogCategories[0] id is NOT == " + this.blogCategory.uid + ", but:" + blogCategories[0].id);
      assert(blogCategories[0].name === newBlogCategoryName, "The blogCategories[0] name is NOT == '" + newBlogCategoryName + "', but:" + blogCategories[0].name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should remove the BlogCategoryEntity from BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategoryRepository.remove({
      uid: this.blogCategory.uid
    }).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should NOT get the BlogCategoryEntity from BlogCategoryForeRunnerDBRepository", function (done) {
    this.blogCategoryRepository.getByUid(this.blogCategory.uid).then((blogCategory) => {
      if (blogCategory === undefined) {
        return done();
      }

      throw new Error("BlogCategoryEntity found into BlogCategoryForeRunnerDBRepository");
    }, err => {
      throw new Error(err);
    });
  });

  after(function () {

  });
});
