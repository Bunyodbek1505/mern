import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:9000/",
  baseURL: "https://mern-backend-zeta.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
