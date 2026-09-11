import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://job-portal-ad90.onrender.com/api",
    withCredentials: true
});

export default axiosInstance;