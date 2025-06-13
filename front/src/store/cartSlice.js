import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';

// --- Async Thunk: 從後端獲取購物車統計 ---
export const fetchCartStatistics = createAsyncThunk(
  'cart/fetchCartStatistics',
  async (accountId, { rejectWithValue }) => {
    try {
      if (!accountId) {
        return { total_items: 0, total_amount: 0 };
      }
      
      const response = await cartService.getCartStatistics(accountId);
      
      if (response.data.status === 200) {
        return response.data.result || { total_items: 0, total_amount: 0 };
      } else {
        return rejectWithValue('獲取購物車統計失敗');
      }
    } catch (error) {
      console.error('獲取購物車統計錯誤:', error);
      return rejectWithValue(error.message || '網路錯誤');
    }
  }
);

// --- 購物車 Slice ---
const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    items: [],
    statistics: {
      total_items: 0,
      total_amount: 0,
      total_types: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    // 添加商品到購物車
    addToCart: (state, action) => {
      const productId = action.payload.id || action.payload.product_id;
      const existingIndex = state.items.findIndex(item => 
        (item.id || item.product_id) === productId
      );
      
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        const productItem = {
          ...action.payload,
          id: productId, // 確保統一使用 id
          quantity: 1
        };
        state.items.push(productItem);
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
      state.statistics = {
        total_items: 0,
        total_amount: 0,
        total_types: 0
      };
    },
    
    // 手動設定購物車統計（用於本地更新）
    setCartStatistics: (state, action) => {
      state.statistics = action.payload;
    }
  },
  
  // --- Extra Reducers: 處理 async thunk ---
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(fetchCartStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 導出 actions
export const { addToCart, updateQuantity, removeFromCart, clearCart, setCartStatistics } = cartSlice.actions;

// 導出 reducer
export default cartSlice.reducer;

// --- 選擇器 ---
// 選擇購物車中的商品
export const selectCartItems = (state) => state.cart.items;

// 選擇購物車統計資料
export const selectCartStatistics = (state) => state.cart.statistics;

// 選擇購物車載入狀態
export const selectCartLoading = (state) => state.cart.loading;

// 選擇購物車錯誤狀態
export const selectCartError = (state) => state.cart.error;

// 計算購物車中商品的總數量（優先使用後端統計，fallback 到本地計算）
export const selectCartItemCount = createSelector(
  [selectCartStatistics, selectCartItems],
  (statistics, items) => {
    // 優先使用後端統計資料
    if (statistics && statistics.total_items !== undefined) {
      return statistics.total_items;
    }
    // Fallback 到本地計算
    return items.reduce((total, item) => total + item.quantity, 0);
  }
);

// 計算購物車中商品的總價格（優先使用後端統計，fallback 到本地計算）
export const selectTotalPrice = createSelector(
  [selectCartStatistics, selectCartItems],
  (statistics, items) => {
    // 優先使用後端統計資料
    if (statistics && statistics.total_amount !== undefined) {
      return statistics.total_amount;
    }
    // Fallback 到本地計算
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
); 