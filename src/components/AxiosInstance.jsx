import axios from "axios";

 export const baseURL = "http://127.0.0.1:8000/api/"//'http://192.168.0.3:8000/api/'
//;

const AxiosInstance = axios.create({
    baseURL: baseURL ,
    timeout: 5000,
        headers: {accept: "application/json",
        "Content-Type": "application/json"
        },
    
});

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error) => {
        return Promise.reject(error);
    }
)


export default AxiosInstance;