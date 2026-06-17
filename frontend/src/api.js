import axios from "axios";

const API = axios.create({
  baseURL: "https://airesume-interview.onrender.com/api",
});

export default API;