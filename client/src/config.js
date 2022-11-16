import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://optimize-check.herokuapp.com/api/"
})