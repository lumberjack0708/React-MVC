/* global Qs */
import Request from '../utils/Request';
import { getApiUrl } from '../config';

/**
 * 購物車服務 - 處理所有購物車相關的API調用
 */
class CartService {
  
  /**
   * 獲取用戶購物車
   * @param {number} accountId - 用戶帳號ID
   * @returns {Promise} API響應
   */
  async getCart(accountId) {
    const url = getApiUrl('getCart');
    const data = Qs.stringify({ account_id: accountId });
    return await Request().post(url, data);
  }
  
  /**
   * 添加商品到購物車
   * @param {number} accountId - 用戶帳號ID
   * @param {number} productId - 商品ID
   * @param {number} quantity - 數量，預設為1
   * @returns {Promise} API響應
   */
  async addToCart(accountId, productId, quantity = 1) {
    const url = getApiUrl('addToCart');
    const data = Qs.stringify({
      account_id: accountId,
      product_id: productId,
      quantity: quantity
    });
    return await Request().post(url, data);
  }
  
  /**
   * 更新購物車商品數量
   * @param {number} accountId - 用戶帳號ID
   * @param {number} cartItemId - 購物車項目ID
   * @param {number} quantity - 新數量
   * @returns {Promise} API響應
   */
  async updateCartItem(accountId, cartItemId, quantity) {
    const url = getApiUrl('updateCartItem');
    const data = Qs.stringify({
      account_id: accountId,
      cart_item_id: cartItemId,
      quantity: quantity
    });
    return await Request().post(url, data);
  }
  
  /**
   * 從購物車移除商品
   * @param {number} accountId - 用戶帳號ID
   * @param {number} cartItemId - 購物車項目ID
   * @returns {Promise} API響應
   */
  async removeFromCart(accountId, cartItemId) {
    const url = getApiUrl('removeFromCart');
    const data = Qs.stringify({
      account_id: accountId,
      cart_item_id: cartItemId
    });
    return await Request().post(url, data);
  }
  
  /**
   * 清空購物車
   * @param {number} accountId - 用戶帳號ID
   * @returns {Promise} API響應
   */
  async clearCart(accountId) {
    const url = getApiUrl('clearCart');
    const data = Qs.stringify({ account_id: accountId });
    return await Request().post(url, data);
  }
  
  /**
   * 獲取購物車統計資訊
   * @param {number} accountId - 用戶帳號ID
   * @returns {Promise} API響應
   */
  async getCartStatistics(accountId) {
    const url = getApiUrl('getCartStatistics');
    const data = Qs.stringify({ account_id: accountId });
    return await Request().post(url, data);
  }
}

const cartService = new CartService();
export default cartService; 