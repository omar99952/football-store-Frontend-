import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api/";


const AxiosInstance = axios.create({
    baseURL: baseURL ,
    timeout: 5000,
        headers: {accept: "application/json",
        "Content-Type": "application/json"
        },
    
});

export default AxiosInstance;