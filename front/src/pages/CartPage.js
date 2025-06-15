/* global Qs */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCartStatistics } from '../store/cartSlice';
import { useNotification } from '../components/Notification';
import { getApiUrl } from '../config';
import cartService from '../services/cartService';
import { 
  Card, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Statistic, 
  Divider, 
  Empty, 
  message, 
  Result,
  Spin,
  Popconfirm,
  InputNumber
} from 'antd';
import { 
  ShoppingOutlined, 
  MinusOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { Container, Heading } from '../styles/styles';
import { CartItemRightContainerStyle } from '../styles/cartPageStyles';
import Request from '../utils/Request';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const { Text } = Typography;

/**
 * @function CartPage
 * @description 購物車頁面元件，與後端購物車API完全整合
 * @param {Object} user - 用戶資訊物件
 * @returns {JSX.Element} 返回購物車頁面的 JSX 結構
 */
function CartPage({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartStats, setCartStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const token = getToken();

  /**
   * 更新購物車統計資料
   */
  const updateCartStats = (items) => {
    if (!Array.isArray(items)) {
      setCartStats({
        total_items: 0,
        total_quantity: 0,
        total_amount: 0
      });
      return;
    }

    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + parseInt(item.item_total, 10), 0);

    setCartStats({
      total_items: totalItems,
      total_quantity: totalQuantity,
      total_amount: totalAmount
    });
  };

  /**
   * 載入購物車資料
   */
  const loadCartData = useCallback(async () => {
    if (!user || !user.account_id) return;
    
    setLoading(true);
    try {
      // 同時載入購物車商品和統計資料
      const [cartResponse, statsResponse] = await Promise.all([
        cartService.getCart(user.account_id),
        cartService.getCartStatistics(user.account_id)
      ]);

      console.log('購物車資料:', cartResponse.data);
      console.log('購物車統計:', statsResponse.data);

      if (cartResponse.data.status === 200) {
        const cartData = cartResponse.data.result;
        // 後端返回的是 { items: [...], statistics: {...} } 格式
        if (cartData && cartData.items) {
          setCartItems(Array.isArray(cartData.items) ? cartData.items : []);
        } else {
          // 如果是直接的陣列格式（向後兼容）
          setCartItems(Array.isArray(cartData) ? cartData : []);
        }
      } else {
        console.error('載入購物車失敗:', cartResponse.data.message);
        setCartItems([]);
      }

      if (statsResponse.data.status === 200) {
        setCartStats(statsResponse.data.result || {});
      } else {
        console.error('載入購物車統計失敗:', statsResponse.data.message);
        setCartStats({});
      }
    } catch (error) {
      console.error('載入購物車資料錯誤:', error);
      notify.error('載入失敗', '無法載入購物車資料，請重新整理頁面');
      // 確保錯誤時也設置為空陣列
      setCartItems([]);
      setCartStats({});
    } finally {
      setLoading(false);
    }
  }, [user, notify]);

  /**
   * 更新商品數量 - 使用樂觀更新
   */
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    // 樂觀更新：先立即更新UI
    const previousItems = [...cartItems];
    const updatedItems = cartItems.map(item => 
      item.cart_item_id === cartItemId 
        ? { 
            ...item, 
            quantity: newQuantity,
            item_total: (newQuantity * item.unit_price)
          }
        : item
    );
    setCartItems(updatedItems);

    // 更新統計資料
    updateCartStats(updatedItems);

    try {
      const response = await cartService.updateCartItem(user.account_id, cartItemId, newQuantity);
      
      if (response.data.status === 200) {
        message.success('數量已更新');
        // 刷新 Redux 購物車統計
        dispatch(fetchCartStatistics(user.account_id));
        // 成功後不需要重新載入，UI已經更新
      } else {
        // 失敗時回滾到原始狀態
        setCartItems(previousItems);
        updateCartStats(previousItems);
        notify.error('更新失敗', response.data.message || '無法更新商品數量');
      }
    } catch (error) {
      // 網路錯誤時回滾到原始狀態
      setCartItems(previousItems);
      updateCartStats(previousItems);
      console.error('更新商品數量錯誤:', error);
      notify.error('更新失敗', '無法更新商品數量，請稍後再試');
    }
  };

  /**
   * 移除購物車商品 - 使用樂觀更新
   */
  const handleRemoveItem = async (cartItemId) => {
    // 樂觀更新：先立即從UI移除
    const previousItems = [...cartItems];
    const updatedItems = cartItems.filter(item => item.cart_item_id !== cartItemId);
    setCartItems(updatedItems);

    // 更新統計資料
    updateCartStats(updatedItems);

    try {
      const response = await cartService.removeFromCart(user.account_id, cartItemId);
      
      if (response.data.status === 200) {
        message.success('商品已移除');
        // 刷新 Redux 購物車統計
        dispatch(fetchCartStatistics(user.account_id));
        // 成功後不需要重新載入，UI已經更新
      } else {
        // 失敗時回滾到原始狀態
        setCartItems(previousItems);
        updateCartStats(previousItems);
        notify.error('移除失敗', response.data.message || '無法移除商品');
      }
    } catch (error) {
      // 網路錯誤時回滾到原始狀態
      setCartItems(previousItems);
      updateCartStats(previousItems);
      console.error('移除商品錯誤:', error);
      notify.error('移除失敗', '無法移除商品，請稍後再試');
    }
  };

  /**
   * 清空購物車 - 使用樂觀更新
   */
  const handleClearCart = async () => {
    // 樂觀更新：先立即清空UI
    const previousItems = [...cartItems];
    const previousStats = { ...cartStats };
    setCartItems([]);
    setCartStats({
      total_items: 0,
      total_quantity: 0,
      total_amount: 0
    });

    try {
      const response = await cartService.clearCart(user.account_id);
      
      if (response.data.status === 200) {
        message.success('購物車已清空');
        // 刷新 Redux 購物車統計
        dispatch(fetchCartStatistics(user.account_id));
        // 成功後不需要重新載入，UI已經更新
      } else {
        // 失敗時回滾到原始狀態
        setCartItems(previousItems);
        setCartStats(previousStats);
        notify.error('清空失敗', response.data.message || '無法清空購物車');
      }
    } catch (error) {
      // 網路錯誤時回滾到原始狀態
      setCartItems(previousItems);
      setCartStats(previousStats);
      console.error('清空購物車錯誤:', error);
      notify.error('清空失敗', '無法清空購物車，請稍後再試');
    }
  };

  /**
   * 結帳處理
   */
  const handleCheckout = async () => {
    if (!user || !user.account_id) {
      notify.warning('請先登入', '您需要登入才能進行結帳！');
      return;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      notify.warning('購物車為空', '您的購物車是空的！');
      return;
    }

    const orderData = {
      account_id: user.account_id,
      products_id: cartItems.map(item => item.product_id),
      quantity: cartItems.map(item => item.quantity)
    };

    console.log('結帳資料:', orderData);

    setCheckoutLoading(true);
    try {
      const response = await Request().post(
        getApiUrl('newOrder'),
        // 將資料轉換為字串格式，並指定陣列的格式化方法為brackets
        Qs.stringify(orderData, { arrayFormat: 'brackets' })
      );
      
      console.log('訂單建立回應:', response.data);
      
      if (response.data.status === 200) {
        const orderId = response.data.order_id;
        notify.success(
          '訂單成功建立', 
          `您的訂單已成功建立！訂單編號：#${orderId}，感謝您的購買。`
        );
        
        // 清空購物車（使用樂觀更新）
        setCartItems([]);
        setCartStats({
          total_items: 0,
          total_quantity: 0,
          total_amount: 0
        });
        
        // 背景清空後端購物車
        cartService.clearCart(user.account_id).catch(console.error);
        // 刷新 Redux 購物車統計
        dispatch(fetchCartStatistics(user.account_id));
        
        // 延遲導航到購買紀錄頁面，讓用戶有時間看到成功消息
        setTimeout(() => {
          navigate('/purchase-history');
        }, 2000);
      } else {
        notify.error('訂單失敗', response.data.message || '建立訂單失敗，請稍後再試。');
      }
    } catch (error) {
      console.error('結帳錯誤:', error);
      notify.error('網路錯誤', '網路錯誤或伺服器無回應，請檢查您的網路連線。');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // 組件掛載時載入購物車資料
  useEffect(() => {
    if (user && user.account_id) {
      loadCartData();
    }
  }, [user, loadCartData]);

  // 如果未登入，顯示登入提示
  if (!token || !user) {
    return (
      <Container>
        <Heading>購物車</Heading>
        <Result
          status="warning"
          title="尚未登入"
          subTitle="您需要登入才能查看購物車並進行結帳。"
          extra={<Button type="primary" onClick={() => navigate('/')}>返回首頁</Button>}
        />
      </Container>
    );
  }

  // 載入中狀態
  if (loading) {
    return (
      <Container>
        <Heading>購物車</Heading>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">載入購物車資料中...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // 如果購物車為空，顯示空狀態
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <Container>
        <Heading>購物車</Heading>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="您的購物車是空的"
          imageStyle={{ height: 60 }}
        >
          <Button type="primary" icon={<ShoppingOutlined />} href="/products">
            去逛逛
          </Button>
        </Empty>
      </Container>
    );
  }

  return (
    <Container>
      <style>
        {`
          .cart-quantity-input .ant-input-number-input {
            text-align: center !important;
          }
        `}
      </style>
      <Heading>購物車</Heading>
      
      {/* 顯示當前用戶資訊 */}
      <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <Space>
          <Text type="secondary">當前用戶：{user.full_name} (ID: {user.account_id})</Text>
          <Divider type="vertical" />
          <Text type="secondary">
            購物車商品：{cartStats.total_items || (Array.isArray(cartItems) ? cartItems.length : 0)} 件
          </Text>
          {cartStats.total_amount && (
            <>
              <Divider type="vertical" />
              <Text type="secondary">
                總金額：NT$ {parseInt(cartStats.total_amount, 10)}
              </Text>
            </>
          )}
        </Space>
      </div>
      
      <Row gutter={[24, 24]}>
        {/* 左欄：商品列表 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 清空購物車按鈕 */}
            <div style={{ textAlign: 'right' }}>
              <Popconfirm
                title="確定要清空購物車嗎？"
                description="此操作將移除所有商品，無法復原。"
                onConfirm={handleClearCart}
                okText="確定清空"
                cancelText="取消"
                okType="danger"
              >
                <Button 
                  icon={<ClearOutlined />} 
                  danger
                >
                  清空購物車
                </Button>
              </Popconfirm>
            </div>

            {Array.isArray(cartItems) && cartItems.map((item) => (
              <Card key={item.cart_item_id} size="small">
                <Row align="middle" gutter={16}>
                  <Col flex="auto">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {item.product_name}
                      </Typography.Title>
                      <Space>
                        <Text type="secondary">
                          購買價格: NT$ {parseInt(item.unit_price, 10)}
                        </Text>
                        {item.current_price !== item.unit_price && (
                          <Text type="warning">
                            (目前價格: NT$ {parseInt(item.current_price, 10)})
                          </Text>
                        )}
                      </Space>
                      <Text type="secondary">
                        小計: NT$ {parseInt(item.item_total, 10)}
                      </Text>
                    </Space>
                  </Col>
                  
                  <Col>
                    <div style={CartItemRightContainerStyle}>
                      <Space size="small" align="center">
                        <Button
                          type="text"
                          icon={<MinusOutlined />}
                          size="small"
                          onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                        />
                        
                        <InputNumber
                          size="small"
                          min={1}
                          max={item.stock || 999}
                          value={item.quantity}
                          style={{ 
                            width: '60px',
                          }}
                          className="cart-quantity-input"
                          controls={false}
                          onChange={(value) => {
                            if (value && value !== item.quantity) {
                              handleQuantityChange(item.cart_item_id, value);
                            }
                          }}
                        />
                        
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                          disabled={item.stock && item.quantity >= item.stock}
                        />
                        
                        <Popconfirm
                          title="確定要移除此商品嗎？"
                          onConfirm={() => handleRemoveItem(item.cart_item_id)}
                          okText="確定"
                          cancelText="取消"
                        >
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                          />
                        </Popconfirm>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </Col>
        
        {/* 右欄：結帳區域 */}
        <Col xs={24} lg={8}>
          <Card title="訂單摘要">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Statistic
                title="商品總數"
                value={cartStats.total_items || (Array.isArray(cartItems) ? cartItems.length : 0)}
                suffix="件"
              />
              <Statistic
                title="總金額"
                value={cartStats.total_amount || (Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + parseInt(item.item_total, 10), 0) : 0)}
                precision={0}
                prefix="NT$"
                valueStyle={{ color: '#3f8600' }}
              />
              {cartStats.unique_products && (
                <Statistic
                  title="商品種類"
                  value={cartStats.unique_products}
                  suffix="種"
                />
              )}
              <Divider />
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
                loading={checkoutLoading}
                disabled={!Array.isArray(cartItems) || cartItems.length === 0}
              >
                立即結帳
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
