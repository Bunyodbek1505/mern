const ProductModel = require("../model/productModel");

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("category").exec();
    // await products.save();
    res.status(200).json({ message: "Muvaffaaqiytli olindi", products });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, color, category, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Mahsulot nomi majburiy." });
    }
    if (!description) {
      return res.status(400).json({ message: "Mahsulot tavsifi majburiy." });
    }
    if (!price || isNaN(price)) {
      return res
        .status(400)
        .json({ message: "Narx majburiy va son bo'lishi kerak." });
    }
    if (!category) {
      return res.status(400).json({ message: "Kategoriya majburiy." });
    }
    if (!image) {
      return res.status(400).json({ message: "Rasm URL majburiy." });
    }

    const newProduct = new ProductModel({
      name,
      description,
      price,
      color,
      category,
      image, 
    });

    await newProduct.save();

    res.status(201).json({ message: "Mahsulot muvaffaqiyatli qo'shildi", newProduct });
  } catch (error) {
    console.error("Serverdagi xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};


const fileUpload = async (req, res) => {
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

// get images
const getImages = async (req, res) => {
  try {
    const product = await ProductModel.findById();
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, category } = req.body;

    const updateData = { ...req.body };

    // Rasm faylini alohida yuklash (agar mavjud bo'lsa).
    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Kategoriyani yangilash (agar mavjud bo'lsa)
    if (category) {
      updateData.category = category;
    }

    const upd_product = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();

    if (!upd_product) {
      return res.status(404).json({ error: "Product topilmadi" });
    }

    res
      .status(200)
      .json({ message: "Product muvaffaqiyatli yangilandi!", upd_product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const del_prd = await ProductModel.findByIdAndDelete(id).exec();
    res.status(200).json({ message: "Product o'chirildi", del_prd });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik bor" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const single_prd = await ProductModel.findOne({ _id: id }).exec();

    res.status(200).json({ message: "Product olib kelindi", single_prd });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor" });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { color, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (color) filter.color = color;

    if (maxPrice || minPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    console.log("Filter:", filter);
    const filterProducts = await ProductModel.find(filter)
      .populate("category")
      .exec();
    res
      .status(200)
      .json({ message: "Muvaffaqaiyatli filterlandi", filterProducts });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik bor" });
  }
};

const productList = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const perPage = 4;

    const products = await ProductModel.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    // Count total products
    const totalProducts = await ProductModel.countDocuments();

    res.status(200).send({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / perPage),
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik bor" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
  singleProduct,
  filterProducts,
  productList,
  getImages,
};
