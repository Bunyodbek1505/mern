const CategoryModel = require("../model/categoryModel");

const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find().exec();
    res.status(200).json({ message: "Muvaffaaqiytli olindi", categories });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Mahsulot nomi majburiy." });
    }
    if (!image || image.trim() === "") {
      return res.status(400).json({ message: "Rasm majburiy." });
    }

    const newCategory = new CategoryModel({
      name,
      image,
    });
    await newCategory.save();
    res.status(201).json({ message: "Muvaffaqiyatli yaratildi", newCategory });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const categoryImage = async (req, res) => {
  try {
    const filePath = req.file.filename;
    if (!filePath) {
      return res.status(400).json({ message: "Fayl yuklanmadi!" });
    }
    res.status(201).json({ url: filePath });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const upd_category = await CategoryModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();
    if (!upd_category) {
      return res.status(404).json({ error: "Category topilmadi" });
    }
    res
      .status(200)
      .json({ message: "Category muvaffaqiyatli yangilandi!", upd_category });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const del_category = await CategoryModel.findByIdAndDelete(id).exec();
    res.status(200).json({ message: "Category o'chirildi", del_category });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik bor" });
  }
};

const categoryList = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const perPage = 2;

    const categories = await CategoryModel.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    // Count total categoryes
    const totalCategoies = await CategoryModel.countDocuments();

    res.status(200).send({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalCategoies / perPage),
      totalCategoies,
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik bor" });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryImage,
  categoryList,
};
