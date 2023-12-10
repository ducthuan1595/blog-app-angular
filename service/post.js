const Post = require("../model/post");
const cloundinary = require("../util/cloudinary");
const pageSection = require("../util/pageSection");

const redisClient = require('../config/redisClient');

exports.getAllPostService = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find()
        .populate("userId", '-password')
        .populate('categoryId')
        .sort([["updatedAt", "desc"]]);
      const result = pageSection(page, limit, posts);
      await redisClient.set("posts", JSON.stringify(posts), {
        EX: 180,
        NX: true,
      });
      resolve({
        status: 201,
        message: "ok",
        data: {
          posts: result.result,
          totalPage: result.totalPage,
          nextPage: page * limit < posts.length,
          prevPage: 0 < page - 1,
          totalPosts: posts.length,
          currPage: page,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getPostsCategory = (page, limit, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find()
        .populate("userId", '-password')
        .populate('categoryId')
        .sort([["updatedAt", "asc"]]);

      const filterPosts = posts.filter(
        (item) => item.categoryId._id.toString() === categoryId.toString()
      );
      const result = pageSection(page, limit, filterPosts);
      resolve({
        status: 201,
        message: "ok",
        data: {
          posts: result.result,
          totalPage: result.totalPage,
          nextPage: page * limit < filterPosts.length,
          prevPage: 0 < page - 1,
          totalPosts: filterPosts.length,
          currPage: page,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
};
exports.getPostsUser = (page, limit, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find()
      .populate("userId", '-password')
      .sort([["updatedAt", "asc"]]);
      
      const filterPosts = posts.filter(
        (item) => item.userId._id.toString() === req.user._id.toString()
      );
      const result = pageSection(page, limit, filterPosts);
      resolve({
        status: 201,
        message: "ok",
        data: {
          posts: result.result,
          totalPage: result.totalPage,
          nextPage: page * limit < filterPosts.length,
          prevPage: 0 < page - 1,
          totalPosts: filterPosts.length,
          currPage: page,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
};
exports.searchPost = (search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyword = search ? {
        $or: [
          {title: {$regex: search, $options: 'i'}},
        ]
      } : {};
      const posts = await Post.find(keyword).populate('userId','-password').populate('categoryId').limit(10);
      if(posts) {
        resolve({
          status: 201,
          message: 'ok',
          data: posts
        })
      }
    } catch (err) {
      reject(err);
    }
  });
};
exports.createPostService = ( title, desc, categoryId, image , req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = new Post({
        title,
        desc,
        userId: req.user._id,
        categoryId,
        image: {
          public_id: image.public_id,
          url: image.url,
        },
      });
      const newPost = await post.save();
      if (newPost) {
        resolve({
          status: 200,
          message: "ok",
          data: newPost,
        });
      }
      resolve({
        status: 201,
        message: "ok",
        data: posts,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.updatePostService = (title, desc, categoryId, image, postId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      if (post.userId.toString() === req.user._id.toString()) {
        post.title = title;
        post.categoryId = categoryId;
        post.desc = desc;
        if (image.url) {
          await cloundinary.destroyCloudinary(post.image.public_id);
          post.image = {
            url: image.url,
            public_id: image.public_id,
          };
        }
        const newPost = await post.save();
        resolve({
          message: "ok",
          status: 200,
          data: newPost,
        });
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.deletePostService = (postId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      if (post.userId.toString() === req.user._id.toString() || req.user.role === 'F2') {
        await cloundinary.destroyCloudinary(post.image.public_id);
        await Post.deleteOne({_id: postId});
        resolve({
          message: "ok",
          status: 200,
        });
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.postDetailService = (postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId).populate('userId', '-password')

      if (post) {
        resolve({
          message: "ok",
          status: 200,
          data: post,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
