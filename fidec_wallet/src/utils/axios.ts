// import axios from "axios";
// import { notification } from "antd";

// export const APIServices = axios.create({
//   baseURL: "http://localhost:8000/",
//   timeout: 5000,
//   headers: {
//      'Content-Type': 'application/json'
//   }
// })

// // Add a request interceptor
// APIServices.interceptors.request.use(
//   (config?: any) => {
//     // console.log(config, "config file");
//     // debugger
//     if (
//       // config.baseURL === baseApiAddress &&
//       !config.headers.Authorization
//     ) {
//       // debugger
//       const token = localStorage.getItem("token");
//       console.log(token);
//       if (token) {
//         // debugger
//         // eslint-disable-next-line no-param-reassign
//         // khi có token, set Auth cho axios
//         // config.headers['Authorization'] = `Bearer ${token}`;
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add a response interceptor
// APIServices.interceptors.response.use(
//   (response) =>
//     // Do something with response data
//     response,
//   (error) => {
//     // const { response } = error;
//     // const payloadRequest = JSON.parse(response?.config?.data ?? '');
//     // if (payloadRequest?.showMes === false) {
//     //   return Promise.reject(error);
//     // }
//     switch (error?.response?.status) {
//       case 400: {
//         notification.error({
//           message: "Bad request",
//           description: "Request failed, please try again",
//         });
//         break;
//       }

//       case 401:
//         localStorage.removeItem("token");

//         break;

//       case 404:
//         break;

//       case 405:
//         break;

//       case 409:
//         break;

//       case 500:
//         break;
//       case 502:
//         break;

//       default:
//         break;
//     }
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

// export default axios;
