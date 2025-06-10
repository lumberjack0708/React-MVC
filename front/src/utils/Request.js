/* global axios */
import { getToken, setToken } from './auth';
import { API_CONFIG } from '../config';
import { tokenManager } from './tokenManager';

/**
 * 建立一個帶有認證標頭的 Axios 實例
 * 參考 Example/front/Request.js
 * @returns {axios.AxiosInstance}
 */
const Request = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Auth = token;
    } else {
      delete config.headers.Auth;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // 成功響應時更新 token
      if (response.data && response.data.token) {
        setToken(response.data.token);
      }
      return response;
    },
    (error) => {
      // 處理錯誤響應
      if (error.response) {
        tokenManager.checkTokenExpiry(error.response);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// let jwtToken = window.localStorage.getItem('jwtToken');
// if(!jwtToken){
//   jwtToken = "000";
// }

// const req = axios.create({
//   baseURL: "http://localhost/FinalProj/backend/public/",
//   headers: {'Auth': jwtToken}
// });
// return req;

export default Request; 