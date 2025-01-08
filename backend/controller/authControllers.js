const {
  UserModel,
  matchPassword,
  hashPassword,
} = require("../model/authModels");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) =>{
  try {
    const users = await UserModel.find({}).exec()
    res.status(200).json({message: "All Users", users})
  } catch (error) {
    res.status(500).json("Serverda xatolik bor");
  }
}
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password){
        return res.status(400).json("Bu maydonlarni to'ldirish majburiy");
    }

    const user = await UserModel.findOne({ email });
    if (user) return res.status(400).json("Bu user allaqachon bor");

    const hashedPassword = await hashPassword(password);
    // create
    const new_user = new UserModel({ name, email, password: hashedPassword });
    await new_user.save();

    // Genetate JWT
    const token = jwt.sign({ id: new_user._id }, "fullstack", { expiresIn: "1d" });

    res.status(201).json({ user: new_user, token })
  } catch (error) {
    res.status(500).json("Serverda xatolik bor");
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid user" });

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "fullstack", { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik bor" });
  }
};


module.exports = { registerController, loginController, getUsers };
