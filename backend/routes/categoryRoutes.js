const express = require("express");
const {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryImage,
  categoryList,
} = require("../controller/categoryController");
const upload = require("../middleware/fileMiddleware");

const router = express.Router();

router.get("/categories", getAllCategory);

router.post("/categories", createCategory);

router.put("/categories/:id", updateCategory);

router.delete("/categories/:id", deleteCategory);

router.post("/category-image", upload.single("image"), categoryImage);

// category pagination 
router.get("/category-pagination", categoryList);

module.exports = router;
