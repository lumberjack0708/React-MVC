/* global axios, qs */

// 根據您的後端伺服器設定，這裡可能需要調整。
// 如果您的 React 開發伺服器和後端在不同埠號，您可能需要提供完整的後端 URL
// 例如：'http://localhost/FinalProj/backend/public/index.php'
// 或者，如果您在 package.json 中設定了代理，這裡可以使用相對路徑。
// 假設您在 front/package.json 中設定了 "proxy": "http://localhost/FinalProj/backend/public/"
// 那麼 baseURL 可以是 '/' 或者一個更特定的基礎路徑 (如果您的 action URL 是從代理根目錄開始的話)
// 為了簡單起見，並且假設代理已正確設定，我們讓 action 成為 URL 的一部分。
const API_BASE_URL = '/index.php'; // 假設代理到 backend/public/

/**
 * 獲取 API 的完整 URL
 * @param {string} action 後端定義的 action 名稱
 * @returns {string} 完整的 API 端點 URL
 */
const getApiUrl = (action) => {
  return `${API_BASE_URL}?action=${action}`;
};

/**
 * 建立一個 axios 實例
 * 您可以在這裡設定通用的配置，例如 headers, timeout 等
 */
const apiClient = axios.create({
  // baseURL: API_BASE_URL, // 如果 getApiUrl 直接返回完整路徑，這裡可以不用 baseURL
  headers: {
    // 'Content-Type': 'application/json', // POST 請求將使用 'application/x-www-form-urlencoded'
    // 如果您的後端 API 需要其他 headers，請在此處添加
  },
});

// 您可以添加請求攔截器或回應攔截器
// apiClient.interceptors.request.use(config => {
//   // 在發送請求之前做些什麼
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// apiClient.interceptors.response.use(response => {
//   return response;
// }, error => {
//   // 處理錯誤
//   return Promise.reject(error);
// });

export { apiClient, getApiUrl };

// 針對產品的 API 呼叫範例 (可以放在這裡或單獨的 productApi.js)
export const fetchProductsFromAPI = () => {
  // 獲取所有產品，基於 front_oldVersion/productInfo.js 使用 GET
  return apiClient.get(getApiUrl('getProducts'));
};

export const fetchProductDetailsFromAPI = (productId) => {
  // 後端 ProductController 的 getProducts 方法期望 POST 請求和 'pid' 參數來獲取單一產品
  const data = { pid: productId };
  return apiClient.post(
    getApiUrl('getProducts'), 
    qs.stringify(data), // 使用 qs.stringify 將 JS 物件轉換為 URL 編碼的字串
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
};
