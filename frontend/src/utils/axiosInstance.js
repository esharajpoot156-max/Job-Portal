import axios from "axios";

const baseURL = import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/v1"
    : "https://job-portal-ad90.onrender.com/api/v1";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
});

export default axiosInstance;