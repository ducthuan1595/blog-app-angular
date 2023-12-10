const Category = require("../model/category");
const User = require("../model/user");
const cloudinary = require("../util/cloudinary");

exports.getAllCategoryService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await Category.find();
      resolve({
        status: 201,
        message: "ok",
        data: categories,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.createCategoryService = (name, image, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F2") {
        const category = new Category({
          name,
          image,
        });
        const newCategory = await category.save();
        if (newCategory) {
          resolve({
            status: 200,
            message: "ok",
            data: newCategory,
          });
        }
        resolve({
          status: 201,
          message: "ok",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.updateCategoryService = (name, image, categoryId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user.role === "F2") {
        const category = await Category.findById(categoryId);
        category.name = name;
        if (image) {
          await cloudinary.destroyCloudinary(category.image.public_id);
          category.image = image;
        }
        await category.save();
        resolve({
          message: "ok",
          status: 200,
          data: category,
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

exports.deleteCategoryService = (categoryId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user.role === "F2") {
        const category = await Category.findById(categoryId);
        await cloudinary.destroyCloudinary(category.image.public_id);
        await Category.findByIdAndDelete(categoryId);
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
