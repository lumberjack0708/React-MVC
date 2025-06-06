export const API_CONFIG = {
  baseURL: "http://localhost/FinalProj/backend/public/index.php",
  assetBaseURL: "http://localhost/FinalProj/backend/",
}

export function getApiUrl(action) {
  return `${API_CONFIG.baseURL}?action=${action}`;
}