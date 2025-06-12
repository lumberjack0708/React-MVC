import React, { useState, useEffect } from 'react';
import { Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import cartService from '../services/cartService';

/**
 * 購物車數量徽章組件
 * 顯示購物車中的商品總數量，與後端API同步
 */
const CartBadge = ({ user, style, ...props }) => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * 載入購物車數量
   */
  const loadCartCount = async () => {
    if (!user || !user.account_id) {
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await cartService.getCartStatistics(user.account_id);
      
      if (response.data.status === 200) {
        const stats = response.data.result || {};
        setCartCount(stats.total_items || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('載入購物車數量錯誤:', error);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 組件掛載時和用戶變更時載入購物車數量
  useEffect(() => {
    loadCartCount();
  }, [user]);

  // 每30秒自動刷新一次購物車數量（可選）
  useEffect(() => {
    if (!user || !user.account_id) return;

    const interval = setInterval(() => {
      loadCartCount();
    }, 30000); // 30秒

    return () => clearInterval(interval);
  }, [user]);

  return (
    <Badge 
      count={cartCount} 
      showZero={false}
      style={style}
      {...props}
    >
      <ShoppingCartOutlined style={{ fontSize: '18px' }} />
    </Badge>
  );
};

export default CartBadge; 