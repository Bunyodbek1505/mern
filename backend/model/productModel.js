const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price:{
        type: Number,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: "Categories"
    },
    image: String
})


const ProductModel = mongoose.model('Products', productSchema)

module.exports = ProductModel