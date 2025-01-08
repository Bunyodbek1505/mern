const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: Number,
        default: 0
    }
}, { timestamps: true })


const hashPassword = async (password) =>{
    const salt = 10
    const hashedPasswod = await bcrypt.hash(password, salt)
    return hashedPasswod
}

const matchPassword = (password, hashedPassword) =>{
    return bcrypt.compare(password, hashedPassword)
}

const UserModel = mongoose.model('UserModel', userSchema)

module.exports = {UserModel, hashPassword, matchPassword};