/* global axios, Qs */
// 匯入 React 相關 Hooks，如 useState
import React, { useState } from 'react';
// 匯入 useNavigate Hook，用於編程式導航
import { useNavigate } from 'react-router-dom';
// 匯入 Redux 相關函數和選擇器
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  selectCartItems, 
  selectTotalPrice 
} from '../store/cartSlice';
// 匯入自定義的 useNotification Hook，用於顯示通知
import { useNotification } from '../components/Notification';
// 匯入 API 配置
import { getApiUrl } from '../config';
// 匯入 Ant Design 元件
import { Card, Button, Typography, Space, Row, Col, Statistic, Divider, Empty } from 'antd';
import { ShoppingOutlined, MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
// 匯入保留的 Emotion 樣式元件
import { Container, Heading } from '../styles/styles';
import { CartItemRightContainerStyle, CartQuantityText } from '../styles/cartPageStyles';

const { Title, Text } = Typography;

/**
 * @function CartPage
 * @description 購物車頁面元件。
 *              顯示購物車中的商品列表，允許用戶更新商品數量、移除商品以及進行結帳。
 * @returns {JSX.Element} 返回購物車頁面的 JSX 結構。
 */
function CartPage() {
  // 使用 useNavigate Hook 獲取導航函數
  const navigate = useNavigate();
  
  // 使用 Redux 選擇器獲取購物車狀態
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  
  // 使用 dispatch 發送 Redux actions
  const dispatch = useDispatch();
  
  // 使用 useNotification Hook 獲取顯示通知的函數
  const { notify } = useNotification();
  
  // loading 狀態用於表示數據是否正在載入
  const [loading, setLoading] = useState(false);
  // error 狀態用於存儲載入數據時發生的錯誤
  const [error, setError] = useState(null);
  
  // 模擬當前用戶ID（實際應用中應該從認證系統獲取）
  const currentUserId = 1;
  
  /**
   * @function handleUpdateQuantity
   * @description 處理更新購物車中商品數量的操作。
   * @param {string} id - 要更新數量的商品 ID。
   * @param {number} newQuantity - 商品的新數量。
   */
  const handleUpdateQuantity = (id, newQuantity) => {
    // 確保商品數量不會小於 1
    if (newQuantity < 1) return;
    // 發送 Redux action 更新購物車狀態
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };
  
  /**
   * @function handleRemoveItem
   * @description 處理從購物車中移除商品的操作。
   * @param {string} id - 要移除的商品 ID。
   */
  const handleRemoveItem = (id) => {
    // 發送 Redux action 移除商品
    dispatch(removeFromCart(id));
  };

  /**
   * @function handleCheckout
   * @description 處理結帳操作。
   *              呼叫後端 newOrder API 建立訂單。
   */
  const handleCheckout = async () => {
    // 檢查購物車是否為空
    if (cartItems.length === 0) {
      // 如果購物車為空，顯示警告通知並返回
      notify.warning('購物車是空的', '請先添加商品到購物車');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 準備 API 請求參數
      const productsId = cartItems.map(item => item.id);
      const quantities = cartItems.map(item => item.quantity);
      
      const requestData = {
        account_id: currentUserId,
        products_id: productsId,
        quantity: quantities
      };

      // 呼叫後端 newOrder API
      const response = await axios.post(
        getApiUrl('newOrder'), 
        Qs.stringify(requestData)
      );

      if (response.data && response.data.status === 200) {
        // 訂單建立成功
        const orderId = response.data.order_id;
        
        // 準備訂單資訊字串，用於顯示確認訊息
        const orderInfo = cartItems.map(item => 
          `${item.name} x ${item.quantity} = $${item.price * item.quantity}`
        ).join('\n');
        
        // 組合完整的訂單確認訊息
        const message = `訂單已成立！\n\n訂單編號：#${orderId}\n\n商品明細：\n${orderInfo}\n\n總金額：$${totalPrice}\n\n感謝您的購買！`;
        
        // 顯示成功通知
        notify.success('訂單建立成功', `訂單編號：#${orderId}`);
        
        // 使用瀏覽器的 alert 函數顯示訂單確認訊息
        alert(message);
        
        // 清空購物車
        dispatch(clearCart());
        
        // 導航到購買紀錄頁面
        navigate('/purchase-history');
        
      } else {
        // 處理 API 回傳的錯誤
        throw new Error(response.data.message || '建立訂單失敗');
      }
      
    } catch (err) {
      // 處理錯誤
      const errorMessage = err.response?.data?.message || err.message || '建立訂單時發生未知錯誤';
      setError(errorMessage);
      notify.error('訂單建立失敗', errorMessage);
      console.error("建立訂單失敗:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // 返回購物車頁面的 JSX 結構
  return (
    <Container>
      {/* 頁面標題，根據目前主題設定樣式 */}
      <Heading>購物車</Heading>
      
      {/* 根據載入、錯誤和購物車狀態顯示不同的內容 */}
      {loading ? (
        <p>處理中...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      // 如果購物車為空，顯示提示訊息和繼續購物的按鈕
      ) : cartItems.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="購物車是空的"
          >
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />}
              onClick={() => navigate('/products')}
            >
              繼續購物
            </Button>
          </Empty>
        </Card>
      // 如果購物車中有商品，則顯示商品列表和訂單摘要
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 遍歷購物車中的商品並為每個商品渲染一個卡片 */}
          {cartItems.map(item => (
            <Card key={item.id}>
              <Row align="middle" justify="space-between">
                <Col span={12}>
                  <Title level={4}>{item.name}</Title>
                  <Text>單價: ${item.price}</Text>
                </Col>
                <Col span={12} style={CartItemRightContainerStyle}>
                  <Space>
                    <Button 
                      icon={<MinusOutlined />}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    />
                    <CartQuantityText>{item.quantity}</CartQuantityText>
                    <Button 
                      icon={<PlusOutlined />}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    />
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      移除
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}
          
          {/* 訂單摘要卡片 */}
          <Card>
            <Title level={3}>訂單摘要</Title>
            <Divider />
            <Statistic
              title="總金額"
              value={totalPrice}
              precision={0}
              prefix="$"
            />
            <Divider />
            <Button 
              type="primary" 
              size="large"
              block
              loading={loading}
              onClick={handleCheckout}
            >
              結帳
            </Button>
          </Card>
        </Space>
      )}
    </Container>
  );
}

export default CartPage;
