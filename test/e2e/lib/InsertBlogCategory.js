var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

module.exports = function (server, blogCategory) {
  return {
    server: server,
    blogCategory: blogCategory,
    exec: function () {
      test("Should insert a new blog category and return a response with status: 201 and the blog category data as body", (done) => {
        this.server
          .post('/blogCategory/')
          .send({
            data: this.blogCategory
          })
          .expect("Content-type", /json/)
          .expect(201)
          .end((err, res) => {
            if (err) throw err;

            assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

            var blogCategory = res.body.data;

            assert(blogCategory.hasOwnProperty("uid") && blogCategory.uid === this.blogCategory.uid, "The response body data has NOT the insert uid value");
            assert(blogCategory.hasOwnProperty("name") && blogCategory.name === this.blogCategory.name, "The response body data has NOT the insert name value");

            done();
          });
      });
    }
  }
}
