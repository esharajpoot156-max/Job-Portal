import axios from "axios";

const axiosInstance = axios.create({
    baseURL: ["http://localhost:8000/api/v1", "https://job-portal-ad90.onrender.com/api"],
    withCredentials: true
});

export default axiosInstance;