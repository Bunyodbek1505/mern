const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoute = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://mern-dashboard-alpha.vercel.app",
    "https://mern-homepage.vercel.app",
    "https://mern-mu-one.vercel.app"
  ], // Allowing frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

const url = "mongodb+srv://exam:exam@cluster0.zov6d.mongodb.net/";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected DB");
  })
  .catch((error) => {
    console.log("DB error:", error);
  });
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", authRoutes);
app.use("/product", authMiddleware, productRoute);
app.use("/category", categoryRoute);

app.listen(9000, () => {
  console.log("Server running 9000 port");
});
