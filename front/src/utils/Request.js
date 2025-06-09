/* global axios */
import { getToken } from './auth';
import { API_CONFIG } from '../config';

/**
 * 建立一個帶有認證標頭的 Axios 實例
 * 參考 Example/front/Request.js
 * @returns {axios.AxiosInstance}
 */
const Request = () => {
  const token = getToken();

  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Auth: token || '',
    },
  });

  return instance;
};

export default Request; 