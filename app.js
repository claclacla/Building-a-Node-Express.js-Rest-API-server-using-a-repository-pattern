var express = require('express');
var bodyParser = require('body-parser');
var config = require("config");

var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();
var db = fdb.db("BlogDB");

var UIDValidator = require("./routes/validators/UIDValidator");
var DTOBodyValidator = require("./routes/validators/DTOBodyValidator");
var QueryParamsValidator = require("./routes/validators/QueryParamsValidator");

var BlogCategoryDTO = require("./dto/BlogCategoryDTO");
var BlogCategoryDTOMapper = require("./dtoMappers/BlogCategoryDTOMapper");
var BlogCategoryEntityMapper = require("./entitiesMappers/BlogCategoryEntityMapper");
var BlogCategoryForeRunnerDBRepository = require('./repositories/ForeRunnerDB/BlogCategoryForeRunnerDBRepository');

var PostDTO = require("./dto/PostDTO");
var PostDTOMapper = require("./dtoMappers/PostDTOMapper");
var PostEntityMapper = require("./entitiesMappers/PostEntityMapper");
var PostForeRunnerDBRepository = require('./repositories/ForeRunnerDB/PostForeRunnerDBRepository');

var QueryRoute = require('./routes/QueryRoute');
var InsertRoute = require('./routes/InsertRoute');
var UpdateRoute = require('./routes/UpdateRoute');
var GetRoute = require('./routes/GetRoute');
var DeleteRoute = require('./routes/DeleteRoute');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// .bind() needed to refer to blogCategoryRoute object

// Init blogCategoryRoute

var blogCategoryRepository = new BlogCategoryForeRunnerDBRepository(db);

var queryBlogCategoryRoute = new QueryRoute(blogCategoryRepository, new BlogCategoryDTOMapper(), new QueryParamsValidator());
app.get('/blogCategory', queryBlogCategoryRoute.use.bind(queryBlogCategoryRoute));

var insertBlogCategoryRoute = new InsertRoute(blogCategoryRepository, new BlogCategoryDTOMapper(), new BlogCategoryEntityMapper(), new DTOBodyValidator(BlogCategoryDTO));
app.post('/blogCategory', insertBlogCategoryRoute.use.bind(insertBlogCategoryRoute));

var updateBlogCategoryRoute = new UpdateRoute(blogCategoryRepository, new BlogCategoryDTOMapper(), new BlogCategoryEntityMapper(), new UIDValidator(), new DTOBodyValidator(BlogCategoryDTO));
app.put('/blogCategory/:uid', updateBlogCategoryRoute.use.bind(updateBlogCategoryRoute));

var getBlogCategoryRoute = new GetRoute(blogCategoryRepository, new BlogCategoryDTOMapper(), new UIDValidator());
app.get('/blogCategory/:uid', getBlogCategoryRoute.use.bind(getBlogCategoryRoute));

var deleteBlogCategoryRoute = new DeleteRoute(blogCategoryRepository, new UIDValidator());
app.delete('/blogCategory/:uid', deleteBlogCategoryRoute.use.bind(deleteBlogCategoryRoute));

// Init postRoute

var postRepository = new PostForeRunnerDBRepository(db, blogCategoryRepository);

var queryPostRoute = new QueryRoute(postRepository, new PostDTOMapper(new BlogCategoryDTOMapper()), new QueryParamsValidator());
app.get('/post', queryPostRoute.use.bind(queryPostRoute));

var insertPostRoute = new InsertRoute(postRepository, new PostDTOMapper(new BlogCategoryDTOMapper()), new PostEntityMapper(new BlogCategoryEntityMapper()), new DTOBodyValidator(PostDTO));
app.post('/post', insertPostRoute.use.bind(insertPostRoute));

var updatePostRoute = new UpdateRoute(postRepository, new PostDTOMapper(new BlogCategoryDTOMapper()), new PostEntityMapper(new BlogCategoryEntityMapper()), new UIDValidator(), new DTOBodyValidator(PostDTO));
app.put('/post/:uid', updatePostRoute.use.bind(updatePostRoute));

var getPostRoute = new GetRoute(postRepository, new PostDTOMapper(new BlogCategoryDTOMapper()), new UIDValidator());
app.get('/post/:uid', getPostRoute.use.bind(getPostRoute));

var deletePostRoute = new DeleteRoute(postRepository, new UIDValidator());
app.delete('/post/:uid', deletePostRoute.use.bind(deletePostRoute));

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
