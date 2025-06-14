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
    statistics: {
      total_items: 0,
      total_amount: 0
    },
    loading: false,
    error: null
  },
  reducers: {},
  
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

// 導出 reducer
export default cartSlice.reducer;

// --- 選擇器 ---
// 購物車統計資料(後端統計)
export const selectCartStatistics = (state) => state.cart.statistics;

// 購物車中商品的總數（後端統計）
export const selectCartItemCount = createSelector(
  [selectCartStatistics],
  (statistics) => {
    return statistics?.total_items || 0;
  }
); 