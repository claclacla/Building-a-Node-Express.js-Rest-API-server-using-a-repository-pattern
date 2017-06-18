var BlogCategoryEntity = require("../../entities/BlogCategoryEntity");
var IRepository = require("../IRepository");
var UID = require("../../lib/uid/UID");

class BlogCategoryForeRunnerDBRepository extends IRepository {
  constructor(db) {
    super();

    this.collection = db.collection("blogCategory");
  }

  add(blogCategory) {
    return new Promise((resolve, reject) => {
      if (!blogCategory instanceof BlogCategoryEntity) return reject("The first argument is NOT a BlogCategoryEntity");

      this.collection
        .insert(blogCategory);

      resolve();
    });
  }

  update(query, blogCategory) {
    return new Promise((resolve, reject) => {
      if (!query instanceof Object) return reject("The first argument is NOT a valid object");
      if (!blogCategory instanceof BlogCategoryEntity) return reject("The second argument is NOT a BlogCategoryEntity");

      this.collection
        .update(query, {
          $replace: blogCategory
        });

      resolve();
    });
  }

  getByUid(uid) {
    return new Promise((resolve, reject) => {
      if (!UID.isValid(uid)) {
        return reject("The first argument is NOT a valid uid");
      }

      var dbBlogCategoryResults = this.collection
        .find({
          uid: uid
        });

      if (dbBlogCategoryResults.length == 0) {
        return resolve(undefined);
      }

      try {
        var blogCategory = new BlogCategoryEntity(dbBlogCategoryResults[0].uid);
        blogCategory.name = dbBlogCategoryResults[0].name;

        resolve(blogCategory);
      } catch (err) {
        reject(err);
      }
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

      var dbBlogCategoryResults = this.collection.find(query, getFilters);

      if (dbBlogCategoryResults.length == 0) {
        return resolve(undefined);
      }

      try {
        var blogCategories = [];

        dbBlogCategoryResults.forEach(dbBlogCategory => {
          var blogCategory = new BlogCategoryEntity(dbBlogCategory.uid);
          blogCategory.name = dbBlogCategory.name;

          blogCategories.push(blogCategory);
        });

        resolve(blogCategories);
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

module.exports = BlogCategoryForeRunnerDBRepository
