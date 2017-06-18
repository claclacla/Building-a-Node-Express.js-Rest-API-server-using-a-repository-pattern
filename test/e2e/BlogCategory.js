var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var UID = require("../../lib/uid/UID");
var BlogCategoryDTO = require("../../dto/BlogCategoryDTO");

var InsertBlogCategory = require("./lib/InsertBlogCategory");

var appPort = config.get("app.port");
var server = supertest.agent("http://localhost:" + appPort);

var blogCategoryUid = UID.create();
var blogCategoryName = "Javascript";

var blogCategory = new BlogCategoryDTO(blogCategoryUid);
blogCategory.name = blogCategoryName;

var newBlogCategoryUid = UID.create();
var newBlogCategoryName = "AngularJs 2";

var newBlogCategory = new BlogCategoryDTO(newBlogCategoryUid);
newBlogCategory.name = newBlogCategoryName;

suite('BlogCategory test', function () {
  before(function () {

  });

  new InsertBlogCategory(server, blogCategory).exec();

  test("Should return a response with status: 404 and NO body", function (done) {
    server
      .get('/blogCategory/' + UID.create())
      .expect("Content-type", /json/)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });

  test("Should get the previous blog category", function (done) {
    server
      .get('/blogCategory/' + blogCategory.uid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resBlogCategory = res.body.data;

        assert(resBlogCategory.hasOwnProperty("uid") && resBlogCategory.uid === blogCategory.uid, "The response body data has NOT the insert uid value");
        assert(resBlogCategory.hasOwnProperty("name") && resBlogCategory.name === blogCategory.name, "The response body data has NOT the insert name value");

        done();
      });
  });

  test("Should update the previous blog category and return a response with status: 200 and the blog category data as body", function (done) {
    blogCategory = new BlogCategoryDTO(blogCategoryUid);
    blogCategory.name = newBlogCategoryName;

    server
      .put('/blogCategory/' + blogCategoryUid)
      .send({
        data: blogCategory
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resBlogCategory = res.body.data;

        assert(resBlogCategory.hasOwnProperty("uid") && resBlogCategory.uid === blogCategory.uid, "The response body data has NOT the insert uid value");
        assert(resBlogCategory.hasOwnProperty("name") && resBlogCategory.name === blogCategory.name, "The response body data has NOT the insert name value");

        done();
      });
  });

  new InsertBlogCategory(server, newBlogCategory).exec();

  test("Should return a response with all categories containing the previous two", function (done) {
    server
      .get('/blogCategory')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var blogCategories = res.body.data;

        [blogCategoryName, newBlogCategoryName].forEach(categoryName => {
          assert(blogCategories.findIndex(blogCategory => blogCategory.name == categoryName) >= 0, "The category name: '" + categoryName + "' has NOT been found in response body data");
        });

        done();
      });
  });

  test("Should return a response with at most two categories", function (done) {
    server
      .get('/blogCategory?skip=1&limit=2')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var blogCategories = res.body.data;

        assert(blogCategories.length <= 2, "The number of categories in NOT less or equal to 2, but: " + blogCategories.length);

        done();
      });
  });

  test("Should return a response with all categories ordered by name", function (done) {
    server
      .get('/blogCategory?sort={"name":1}')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var blogCategories = res.body.data;
        var previousCategory = null;

        blogCategories.forEach(category => {
          if (previousCategory !== null) {
            assert(category.name >= previousCategory.name, "The categories are NOT ordered by name. Current name: " + category.name + ", previous name: " + previousCategory.name);
          }

          previousCategory = category;
        });

        done();
      });
  });

  test("Should return a response containing the category with uid = '" + blogCategoryUid + "'", function (done) {
    server
      .get('/blogCategory?q={"uid":"' + blogCategoryUid + '"}')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var blogCategories = res.body.data;

        assert(blogCategories.length == 1, "The response body data doesn't contain one category");
        assert(blogCategories[0].uid == blogCategoryUid, "The category uid: '" + blogCategoryUid + "' has NOT been found in response body data");

        done();
      });
  });

  test("Should return a response with status: 200 and NO body", function (done) {
    server
      .delete('/blogCategory/' + blogCategoryUid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });

  test("Should return a response with status: 200 and NO body", function (done) {
    server
      .delete('/blogCategory/' + newBlogCategoryUid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });
});
