import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// --- Redux 商店配置 ---
export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  // 添加開發工具支持
  devTools: process.env.NODE_ENV !== 'production'
}); 