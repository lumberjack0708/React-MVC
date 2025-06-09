const TOKEN_KEY = 'jwtToken';

/**
 * 從 localStorage 獲取 token
 * @returns {string|null}
 */
export const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY);
};

/**
 * 將 token 存入 localStorage
 * @param {string} token
 */
export const setToken = (token) => {
  window.localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 從 localStorage 移除 token
 */
export const removeToken = () => {
  window.localStorage.removeItem(TOKEN_KEY);
}; 