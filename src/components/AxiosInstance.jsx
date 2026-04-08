import axios from "axios";

const baseURL = "http://192.168.0.7:8000/api/";


const AxiosInstance = axios.create({
    baseURL: baseURL ,
    timeout: 5000,
        headers: {accept: "application/json",
        "Content-Type": "application/json"
        },
    
});

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Token ${token}`
    }
    return config
})


export default AxiosInstance;