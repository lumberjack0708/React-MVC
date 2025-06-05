import { createSlice, createSelector } from '@reduxjs/toolkit';

// --- 購物車 Slice ---
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    // 添加商品到購物車
    addToCart: (state, action) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    
    // 更新購物車中商品數量
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity < 1) return;
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = quantity;
      }
    },
    
    // 從購物車中移除商品
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    // 清空購物車
    clearCart: (state) => {
      state.items = [];
    }
  }
});

// 導出 actions
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// 導出 reducer
export default cartSlice.reducer;

// --- 選擇器 ---
// 選擇購物車中的商品
export const selectCartItems = (state) => state.cart.items;

// 計算購物車中商品的總數量
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// 計算購物車中商品的總價格
export const selectTotalPrice = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
); 