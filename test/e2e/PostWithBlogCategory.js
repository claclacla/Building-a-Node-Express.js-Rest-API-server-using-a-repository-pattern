var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var UID = require("../../lib/uid/UID");
var PostDTO = require("../../dto/PostDTO");
var BlogCategoryDTO = require("../../dto/BlogCategoryDTO");

var InsertBlogCategory = require("./lib/InsertBlogCategory");

var appPort = config.get("app.port");
var server = supertest.agent("http://localhost:" + appPort);

var blogCategory = new BlogCategoryDTO(UID.create());
blogCategory.name = "Javascript";

var postUid = UID.create();
var postTitle = "Javascript proxy object";

var post = new PostDTO(postUid);
post.title = postTitle;
post.blogCategory = blogCategory;

var newPostUid = UID.create();
var newPostTitle = "AngularJs 2 proxy object wrapper";

var newPost = new PostDTO(newPostUid);
newPost.title = postTitle;
newPost.blogCategory = blogCategory;

suite('Post test with blogCategory', function () {
  before(function () {

  });

  new InsertBlogCategory(server, blogCategory).exec();

  test("Should insert a new post and return a response with status: 201 and the post data as body", function (done) {
    server
      .post('/post/')
      .send({
        data: post
      })
      .expect("Content-type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resPost = res.body.data;

        assert(resPost.hasOwnProperty("uid") && resPost.uid === post.uid, "The response body data has NOT the insert uid value");
        assert(resPost.hasOwnProperty("title") && resPost.title === post.title, "The response body data has NOT the insert title value");
        assert(resPost.hasOwnProperty("blogCategory") && resPost.blogCategory.name === post.blogCategory.name, "The response body data has NOT the insert blog category name value");

        done();
      });
  });

  test("Should return a response with status: 404 and NO body", function (done) {
    server
      .get('/post/' + UID.create())
      .expect("Content-type", /json/)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });

  test("Should get the previous post", function (done) {
    server
      .get('/post/' + post.uid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resPost = res.body.data;

        assert(resPost.hasOwnProperty("uid") && resPost.uid === post.uid, "The response body data has NOT the insert uid value");
        assert(resPost.hasOwnProperty("title") && resPost.title === post.title, "The response body data has NOT the insert title value");
        assert(resPost.hasOwnProperty("blogCategory") && resPost.blogCategory.name === post.blogCategory.name, "The response body data has NOT the insert blog category name value");

        done();
      });
  });

  test("Should update the previous post and return a response with status: 200 and the post data as body", function (done) {
    post = new PostDTO(postUid);
    post.title = newPostTitle;
    post.blogCategory = blogCategory;

    server
      .put('/post/' + postUid)
      .send({
        data: post
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resPost = res.body.data;

        assert(resPost.hasOwnProperty("uid") && resPost.uid === post.uid, "The response body data has NOT the insert uid value");
        assert(resPost.hasOwnProperty("title") && resPost.title === post.title, "The response body data has NOT the insert title value");
        assert(resPost.hasOwnProperty("blogCategory") && resPost.blogCategory.name === post.blogCategory.name, "The response body data has NOT the insert blog category name value");

        done();
      });
  });

  test("Should insert a new post and return a response with status: 201 and the post data as body", function (done) {
    server
      .post('/post/')
      .send({
        data: newPost
      })
      .expect("Content-type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resPost = res.body.data;

        assert(resPost.hasOwnProperty("uid") && resPost.uid === newPost.uid, "The response body data has NOT the insert uid value");
        assert(resPost.hasOwnProperty("title") && resPost.title === newPost.title, "The response body data has NOT the insert title value");
        assert(resPost.hasOwnProperty("blogCategory") && resPost.blogCategory.name === post.blogCategory.name, "The response body data has NOT the insert blog category name value");

        done();
      });
  });

  test("Should return a response with all posts containing the previous two", function (done) {
    server
      .get('/post')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var posts = res.body.data;

        [postTitle, newPostTitle].forEach(postTitle => {
          assert(posts.findIndex(post => post.title == postTitle) >= 0, "The post title: '" + postTitle + "' has NOT been found in response body data");
        });

        done();
      });
  });

  test("Should return a response with at most two posts", function (done) {
    server
      .get('/post?skip=1&limit=2')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var posts = res.body.data;

        assert(posts.length <= 2, "The number of posts in NOT less or equal to 2, but: " + posts.length);

        done();
      });
  });

  test("Should return a response with all posts ordered by title", function (done) {
    server
      .get('/post?sort={"title":1}')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var posts = res.body.data;
        var previousPost = null;

        posts.forEach(post => {
          if (previousPost !== null) {
            assert(post.title >= previousPost.title, "The posts are NOT ordered by title. Current title: " + post.title + ", previous title: " + previousPost.title);
          }

          previousPost = post;
        });

        done();
      });
  });

  test("Should return a response containing the post with uid = '" + postUid + "'", function (done) {
    server
      .get('/post?q={"uid":"' + postUid + '"}')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var posts = res.body.data;

        assert(posts.length == 1, "The response body data doesn't contain one post");
        assert(posts[0].uid == postUid, "The post uid: '" + postUid + "' has NOT been found in response body data");

        done();
      });
  });

  test("Should return a response with status: 200 and NO body", function (done) {
    server
      .delete('/post/' + postUid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });

  test("Should return a response with status: 200 and NO body", function (done) {
    server
      .delete('/post/' + newPostUid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });
});
