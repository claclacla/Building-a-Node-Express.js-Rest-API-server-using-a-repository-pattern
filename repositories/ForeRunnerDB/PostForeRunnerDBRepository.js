var async = require('async');

var PostEntity = require("../../entities/PostEntity");
var IRepository = require("../IRepository");
var UID = require("../../lib/uid/UID");

class PostForeRunnerDBRepository extends IRepository {
  constructor(db, blogCategoryRepository) {
    super();

    this.collection = db.collection("post");
    this.blogCategoryRepository = blogCategoryRepository;
  }

  toDocument(post) {
    var dbPost = JSON.parse(JSON.stringify(post));

    if (dbPost.blogCategory) {
      dbPost.blogCategory = dbPost.blogCategory.uid;
    }

    return dbPost;
  }

  toEntity(dbPost) {
    return new Promise((resolve, reject) => {
      try {
        var post = new PostEntity(dbPost.uid);
        post.title = dbPost.title;
        post.intro = dbPost.intro;
        post.text = dbPost.text;

        if (dbPost.blogCategory) {
          this.blogCategoryRepository.getByUid(dbPost.blogCategory).then((blogCategory) => {
            if (blogCategory === undefined) {
              return reject("Post.blogCategory NOT found on blogCategoryRepository");
            }

            post.blogCategory = blogCategory;

            resolve(post);
          }, err => {
            reject(err);
          });
        } else {
          resolve(post);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  add(post) {
    return new Promise((resolve, reject) => {
      if (!post instanceof PostEntity) return reject("The first argument is NOT a PostEntity");

      var dbPost = this.toDocument(post);

      this.collection
        .insert(dbPost);

      resolve();
    });
  }

  update(query, post) {
    return new Promise((resolve, reject) => {
      if (!query instanceof Object) return reject("The first argument is NOT a valid object");
      if (!post instanceof PostEntity) return reject("The second argument is NOT a PostEntity");

      var dbPost = this.toDocument(post);

      this.collection
        .update(query, {
          $replace: dbPost
        });

      resolve();
    });
  }

  getByUid(uid) {
    return new Promise((resolve, reject) => {
      if (!UID.isValid(uid)) {
        return reject("The first argument is NOT a valid uid");
      }

      var dbPostResults = this.collection
        .find({
          uid: uid
        });

      if (dbPostResults.length == 0) {
        return resolve(undefined);
      }

      this.toEntity(dbPostResults[0]).then((post) => {
        resolve(post);
      }, (err) => {
        reject(err);
      });
    });
  }

  mapGetFilters(filters) {
    var getFilters = {};

    if (filters === undefined) {
      return undefined;
    }

    if (filters[this.GET_FILTER_SORT]) {
      getFilters.$orderBy = filters[this.GET_FILTER_SORT];
    }

    if (filters[this.GET_FILTER_SKIP]) {
      getFilters.$skip = filters[this.GET_FILTER_SKIP];
    }

    if (filters[this.GET_FILTER_LIMIT]) {
      getFilters.$limit = filters[this.GET_FILTER_LIMIT];
    }

    return getFilters;
  }

  get(query, filters) {
    return new Promise((resolve, reject) => {
      try {
        filters = this.validateGetFilters(filters);
      } catch (err) {
        return reject(err);
      }

      var getFilters = this.mapGetFilters(filters);

      var dbPostResults = this.collection.find(query, getFilters);

      if (dbPostResults.length == 0) {
        return resolve(undefined);
      }

      try {
        var blogCategories = [];

        async.eachSeries(dbPostResults, (dbPost, cb) => {
          this.toEntity(dbPost).then((post) => {
            blogCategories.push(post);
            cb();
          }, (err) => {
            cb(err);
          });
        }, function (err) {
          if (err) {
            return reject(err);
          }

          resolve(blogCategories);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  remove(filter) {
    return new Promise((resolve, reject) => {
      this.collection.remove(filter);

      resolve();
    });
  }
}

module.exports = PostForeRunnerDBRepository
