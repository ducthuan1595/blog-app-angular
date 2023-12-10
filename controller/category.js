const categoryService = require("../service/category");

exports.getCategory = async (req, res) => {
  const data = await categoryService.getAllCategoryService();
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.createCategory = async (req, res) => {
  const { name, image } = req.body;
  if (!name || !image) {
    return res.status(404).json({ message: "Not found" });
  }
  const data = await categoryService.createCategoryService(name, image, req);
  res.status(data.status).json({ message: data.message, data: data?.data });
};

exports.updateCategory = async (req, res) => {
  const { name, categoryId, image } = req.body;
  if (!name || !categoryId) {
    return res.status(404).json({ message: "Not found" });
  }
  const data = await categoryService.updateCategoryService(
    name,
    image,
    categoryId,
    req
  );
  res.status(data.status).json({ message: data.message, data: data?.data });
};

exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.query;
  if (!categoryId) {
    return res.status(404).json({ message: "Not found" });
  }
  const data = await categoryService.deleteCategoryService(categoryId, req);
  res.status(data.status).json({ message: data.message });
};
