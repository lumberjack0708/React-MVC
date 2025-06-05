export const API_CONFIG = {
  baseURL: "../backend/pubic/index.php",
}

export function getApiUrl(action) {
  return `${API_CONFIG.baseURL}?action=${action}`;
}

export default API_CONFIG;