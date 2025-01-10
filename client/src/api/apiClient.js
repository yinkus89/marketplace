import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4001/api", // Replace with your backend URL
});

export default API;
