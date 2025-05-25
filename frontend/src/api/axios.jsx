// import axios from 'axios';

// // Thiết lập URL cơ sở - chỉ đến gốc của Laravel, không cần thêm /api
// axios.defaults.baseURL = 'http://localhost:8000';

// // Thêm interceptor để thêm token vào các yêu cầu
// axios.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// export default axios;