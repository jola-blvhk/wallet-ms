import axios from "axios";

const api = axios.create({
  baseURL: "https://sandbox-0.blnkfinance.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
