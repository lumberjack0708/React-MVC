import { removeToken } from './auth';

class TokenManager {
  constructor() {
    this.isTokenExpired = false;
    this.hasNotified = false; // 防止重複通知
  }

  // 檢查 token 是否過期
  checkTokenExpiry(response) {
    if (this.hasNotified) {
      return true; // 已經通知過，直接返回
    }

    if (response?.data?.status === 401 || response?.data?.status === 403) {
      const message = response.data.message || '';
      if (message.includes('Expired token') || 
          message.includes('Token無效') || 
          message.includes('Token過期') ||
          message.includes('Missing authentication token')) {
        
        if (!this.hasNotified) {
          this.isTokenExpired = true;
          this.hasNotified = true;
          removeToken();
          return true;
        }
      }
    }
    return false;
  }

  // 重置狀態（用於重新登入後）
  reset() {
    this.isTokenExpired = false;
    this.hasNotified = false;
  }

  // 取得當前狀態
  getExpiredStatus() {
    return this.isTokenExpired;
  }
}

// 建立單例
export const tokenManager = new TokenManager(); 