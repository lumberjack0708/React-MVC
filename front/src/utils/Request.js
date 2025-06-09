/* global axios */
import { getToken, setToken } from './auth';
import { API_CONFIG } from '../config';

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

  instance.interceptors.response.use((response) => {
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response;
  });

  return instance;
};

export default Request; 