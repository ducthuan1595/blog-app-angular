const express = require("express");

const authController = require("../controller/auth");
const postController = require("../controller/post");
const categoryController = require("../controller/category");

const authMiddware = require("../minddleware/auth");
// const cacheData = require("../minddleware/credis");

const router = express.Router();

const init = (app) => {
  router.get("/", (req, res) => {
    res.send("Home server!");
  });

  // auth
  router.post("/v1/api/signup", authController.signup);
  router.post("/v1/api/login", authController.login);
  router.post("/v1/api/login-ad", authController.loginAdmin);

  // Post
  router.get("/v1/api/posts", postController.getPosts);
  router.get("/v1/api/posts-category", postController.getPostsCategory);
  router.get("/v1/api/posts-user", authMiddware.protect, postController.getPostsUser);
  router.get("/v1/api/search", postController.searchPost);
  router.post(
    "/v1/api/create-post",
    authMiddware.protect,
    postController.createPost
  );
  router.put(
    "/v1/api/update-post",
    authMiddware.protect,
    postController.updatePost
  );
  router.delete(
    "/v1/api/delete-post",
    authMiddware.protect,
    postController.deletePost
  );
  router.get("/v1/api/post-detail", postController.postDetail);

  // Category
  router.get("/v1/api/category", categoryController.getCategory);
  router.post(
    "/v1/api/create-category",
    authMiddware.protect,
    categoryController.createCategory
  );
  router.put(
    "/v1/api/update-category",
    authMiddware.protect,
    categoryController.updateCategory
  );
  router.delete(
    "/v1/api/delete-category",
    authMiddware.protect,
    categoryController.deleteCategory
  );

  return app.use(router);
};

module.exports = init;
