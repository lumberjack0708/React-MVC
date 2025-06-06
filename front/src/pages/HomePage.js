/* global axios, Qs */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { getApiUrl } from '../config'; // 引入 API 呼叫
import { useNotification } from '../components/Notification';
import { Container, Heading, ProductImage as StyledProductImage } from '../styles/styles';
import { Card, Button, Typography, Row, Col, Spin, Space, Statistic } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { getProductImage } from '../assets/images/index';

const { Title, Paragraph, Text } = Typography;

/**
 * @function HomePage
 * @description 首頁元件，展示歡迎訊息、導覽按鈕與推薦商品。
 *              推薦商品模擬從伺服器取得，並可直接加入購物車。
 * @returns {JSX.Element} 返回首頁的 JSX 結構。
 */
function HomePage() {
  const navigate = useNavigate();       // 用於頁面導覽
  const dispatch = useDispatch();       // 使用 dispatch 發送 Redux actions
  const { notify } = useNotification(); // 取得通知顯示函數
  const [featuredProducts, setFeaturedProducts] = useState([]); // 推薦商品狀態
  const [loading, setLoading] = useState(true);                // 載入狀態
  const [error, setError] = useState(null);                   // 錯誤狀態

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(getApiUrl('getProducts'), Qs.stringify({}));
        if (response.data && response.data.status === 200) {
          const formattedProducts = response.data.result.map(p => ({
            id: p.product_id,
            name: p.name,
            price: parseFloat(p.price),
            category: p.category,
            stock: parseInt(p.stock, 10),
          }));
          setFeaturedProducts(formattedProducts.slice(0, 3));
        } else {
          throw new Error(response.data.message || '無法獲取推薦產品');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || '載入推薦產品時發生未知錯誤';
        setError(errorMessage);
        notify.error('載入推薦產品失敗', errorMessage);
        console.error("載入推薦產品失敗:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, [notify]);
  
  // 處理添加商品到購物車
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    notify.success(
      '已加入購物車', 
      `${product.name} 已成功加入您的購物車！`
    );
  };
  
  return (
    <Container>
      <Heading>寵物百貨歡迎您</Heading>
      
      <Card style={{ marginBottom: 30, textAlign: 'center' }}>
        <Title level={2}>為您的毛小孩找到最好的</Title>
        <Paragraph>我們的寵物百貨提供各種優質的寵物產品，包括食品、玩具、配件和保健用品。</Paragraph>
        <Space style={{ marginTop: '20px' }}>
          <Button 
            type="primary" 
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/products')}
          >
            瀏覽全部商品
          </Button>
        </Space>
      </Card>
      
      <div style={{ marginTop: '30px' }}>
        <Title level={3} style={{ marginBottom: '20px', textAlign: 'center' }}>熱門推薦</Title>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
        )}
        {!loading && error && featuredProducts.length === 0 && (
           <div style={{ textAlign: 'center', padding: '20px' }}><Text type="danger">無法載入推薦產品: {error}</Text></div>
        )}
        {!loading && !error && featuredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}><Text>暫無推薦產品。</Text></div>
        )}

        {!loading && featuredProducts.length > 0 && (
          <Row gutter={[16, 24]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={8} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <StyledProductImage 
                      src={getProductImage(product.category, product.name) || '/placeholder.png'} 
                      alt={product.name || '產品圖片'}
                      style={{ height: 200, objectFit: 'contain', padding: '10px' }}
                    />
                  }
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />}
                      onClick={() => navigate('/products')}
                    >
                      查看商品
                    </Button>,
                    <Button 
                      type="text" 
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product)}
                    >
                      直接購買
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={<Title level={4} style={{ minHeight: '56px'}}>{product.name || '未命名產品'}</Title>}
                    description={
                      <Statistic 
                        value={product.price} 
                        prefix="NT$"
                        precision={2}
                        valueStyle={{ color: '#2B2118', fontSize: '18px' }}
                      />
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  );
}

export default HomePage;
