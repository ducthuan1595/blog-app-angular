const postService = require("../service/post");

exports.getPosts = async (req, res) => {
  const { limit, page } = req.query;
  const data = await postService.getAllPostService(page, limit);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getPostsCategory = async (req, res) => {
  const { limit, page, categoryId } = req.query;
  const data = await postService.getPostsCategory(page, limit, categoryId);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
exports.getPostsUser = async (req, res) => {
  const { limit, page } = req.query;
  const data = await postService.getPostsUser(page, limit, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.searchPost = async (req, res) => {
  const { search } = req.query;
  const data = await postService.searchPost(search);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
exports.createPost = async (req, res) => {
  const { title, desc, categoryId, image } = req.body;
  if (!title || !image || !desc || !categoryId) {
    return res.status(400).json({ message: "Not found" });
  }
  const data = await postService.createPostService(title, desc, categoryId, image, req);
  res.status(data.status).json({ message: data.message, data: data?.data });
};

exports.updatePost = async (req, res) => {
  const { title, desc, categoryId, image, postId } = req.body;
  if (!title || !desc || !categoryId || !postId) {
    return res.status(400).json({ message: "Not found" });
  }
  const data = await postService.updatePostService(title, desc, categoryId, image, postId, req);
  res.status(data.status).json({ message: data.message, data: data?.data });
};

exports.deletePost = async (req, res) => {
  const { postId } = req.query;
  if (!postId) {
    return res.status(400).json({ message: "Not found" });
  }
  const data = await postService.deletePostService(postId, req);
  res.status(data.status).json({ message: data.message });
};

exports.postDetail = async (req, res) => {
  const { postId } = req.query;
  if (!postId) {
    return res.status(400).json({ message: "Not found" });
  }
  const data = await postService.postDetailService(postId);
  res.status(data.status).json({ message: data.message, data: data?.data });
};
