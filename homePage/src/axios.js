import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:9000/",
  baseURL: "https://backend-fuom.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
