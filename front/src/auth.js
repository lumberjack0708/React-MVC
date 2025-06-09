// 簡單的 auth 工具
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// API 呼叫時加入 Auth header
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { 'Auth': token } : {};
};
