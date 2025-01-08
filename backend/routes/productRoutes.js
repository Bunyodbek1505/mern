const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
  singleProduct,
  filterProducts,
  productList,
  getImages
} = require("../controller/productController");
const upload = require("../middleware/fileMiddleware");

const router = express.Router();

router.get("/products", getAllProducts);

router.post("/products", createProduct);

router.post("/upload", upload.single("image"), fileUpload);

// get image
router.get('/get-image', getImages)

router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

//  get single product
router.get("/single-product/:id", singleProduct);

// product filter (color, price, category)
router.get("/filter-product", filterProducts);

//  product pagination
router.get("/product-pagination", productList);

module.exports = router;
