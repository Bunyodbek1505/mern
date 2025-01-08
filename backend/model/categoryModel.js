const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
});

const CategoryModel = mongoose.model("Categories", categorySchema)

module.exports = CategoryModel