import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config:any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
