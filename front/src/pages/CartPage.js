/* global Qs */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  clearCart, 
  removeFromCart, 
  updateQuantity, 
  selectCartItems, 
  selectTotalPrice 
} from '../store/cartSlice';
import { useNotification } from '../components/Notification';
import { getApiUrl } from '../config';
import { Card, Button, Typography, Space, Row, Col, Statistic, Divider, Empty, message } from 'antd';
import { ShoppingOutlined, MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Container, Heading } from '../styles/styles';
import { CartItemRightContainerStyle, CartQuantityText } from '../styles/cartPageStyles';
import Request from '../utils/Request';

const { Text } = Typography;

/**
 * @function CartPage
 * @description 購物車頁面元件。
 *              顯示購物車中的商品列表，允許用戶更新商品數量、移除商品以及進行結帳。
 * @returns {JSX.Element} 返回購物車頁面的 JSX 結構。
 */
function CartPage() {
  // 使用 Redux 選擇器獲取購物車狀態
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  
  const dispatch = useDispatch();   // 使用 dispatch 發送 Redux actions
  const { notify } = useNotification(); // 取得通知顯示函數
  
  /**
   * 處理結帳按鈕點擊事件
   * 呼叫後端 API 建立新訂單
   */
  const handleCheckout = async () => {
    // 假設用戶ID為2，後續應從登入狀態獲取
    const currentUserId = 2; 

    if (cartItems.length === 0) {
      message.warning('您的購物車是空的！');
      return;
    }

    const orderData = {
      account_id: currentUserId,
      products_id: cartItems.map(item => item.id),
      quantity: cartItems.map(item => item.quantity)
    };

    try {
      const response = await Request().post(
        getApiUrl('newOrder'),
        Qs.stringify(orderData, { arrayFormat: 'brackets' }) // 重要：後端PHP需要這種格式來解析陣列
      );
      if (response.data.status === 200) {
        message.success('訂單已成功建立！');
        dispatch(clearCart());
      } else {
        message.error(response.data.message || '建立訂單失敗');
      }
    } catch (error) {
      console.error('結帳失敗:', error);
      message.error('網路錯誤或伺服器無回應');
    }
  };

  /**
   * 處理移除購物車商品
   */
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    notify.info('商品已移除', '商品已從購物車中移除');
  };

  /**
   * 處理商品數量變更
   */
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  // 如果購物車為空，顯示空狀態
  if (cartItems.length === 0) {
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
      <Heading>購物車</Heading>
      
      <Row gutter={[24, 24]}>
        {/* 左欄：商品列表 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {cartItems.map((item) => (
              <Card key={item.id} size="small">
                <Row align="middle" gutter={16}>
                  <Col flex="auto">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {item.name}
                      </Typography.Title>
                      <Text type="secondary">單價: ${item.price}</Text>
                    </Space>
                  </Col>
                  
                  <Col>
                    <div style={CartItemRightContainerStyle}>
                      <Space size="small" align="center">
                        <Button
                          type="text"
                          icon={<MinusOutlined />}
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        />
                        <Text style={CartQuantityText}>{item.quantity}</Text>
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        />
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          onClick={() => handleRemoveItem(item.id)}
                        />
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
                title="總金額"
                value={totalPrice}
                precision={0}
                prefix="$"
                valueStyle={{ color: '#3f8600' }}
              />
              <Divider />
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
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
