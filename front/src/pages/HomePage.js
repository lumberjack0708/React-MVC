/* global Qs */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { getApiUrl } from '../config'; // 引入 API 呼叫
import { useNotification } from '../components/Notification';
import { Container, Heading, ProductImage as StyledProductImage } from '../styles/styles';
import {
  WelcomeCardStyle,
  WelcomeCardSpace,
  RecommendedSection,
  RecommendedTitle,
  LoadingRecommendedContainer,
  ErrorRecommendedContainer,
  EmptyRecommendedContainer,
  RecommendedProductImageStyle,
  RecommendedProductTitle,
  RecommendedProductPriceStyle
} from '../styles/homePageStyles';
import { Card, Button, Typography, Row, Col, Spin, Statistic } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { getProductImage } from '../assets/images/index';
import Request from '../utils/Request';

const { Title, Paragraph, Text } = Typography;

/**
 * @function HomePage
 * @description 首頁元件，展示歡迎訊息、導覽按鈕與推薦商品。
 *              推薦商品模擬從伺服器取得，並可直接加入購物車。
 * @returns {JSX.Element} 返回首頁的 JSX 結構。
 */
function HomePage({ user, isLoggedIn, onLoginRequest }) {
  const navigate = useNavigate();       // 用於頁面導覽
  const dispatch = useDispatch();       // 使用 dispatch 發送 Redux actions
  const { notify } = useNotification(); // 取得通知顯示函數
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Request().post(getApiUrl('getProducts'), Qs.stringify({}));
        // 只取前 8 項作為特色商品
        setProducts(response.data.result.slice(0, 8) || []);
      } catch (error) {
        console.error("無法獲取特色商品:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  // 處理添加商品到購物車
  const handleAddToCart = (product) => {
    // 檢查用戶是否已登入
    if (!isLoggedIn || !user) {
      notify.warning(
        '請先登入', 
        '您需要先登入才能將商品加入購物車！'
      );
      // 觸發登入彈窗
      if (onLoginRequest) {
        onLoginRequest();
      }
      return;
    }

    dispatch(addToCart(product));
    notify.success(
      '已加入購物車', 
      `${product.name} 已成功加入您的購物車！`
    );
  };
  
  return (
    <Container>
      <Heading>寵物百貨歡迎您</Heading>
      
      <Card style={WelcomeCardStyle}>
        <Title level={2}>為您的毛小孩找到最好的</Title>
        <Paragraph>我們的寵物百貨提供各種優質的寵物產品，包括食品、玩具、配件和保健用品。</Paragraph>
        <WelcomeCardSpace>
          <Button 
            type="primary" 
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/products')}
          >
            瀏覽全部商品
          </Button>
        </WelcomeCardSpace>
      </Card>
      
      <RecommendedSection>
        <RecommendedTitle>熱門推薦</RecommendedTitle>
        
        {loading && (
          <LoadingRecommendedContainer><Spin size="large" /></LoadingRecommendedContainer>
        )}
        {!loading && products.length === 0 && (
            <EmptyRecommendedContainer><Text>暫無推薦產品。</Text></EmptyRecommendedContainer>
        )}

        {!loading && products.length > 0 && (
          <Row gutter={[16, 24]}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <StyledProductImage 
                      src={getProductImage(product.category, product.name) || '/placeholder.png'} 
                      alt={product.name || '產品圖片'}
                      style={RecommendedProductImageStyle}
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
                    title={<RecommendedProductTitle>{product.name || '未命名產品'}</RecommendedProductTitle>}
                    description={
                      <Statistic 
                        value={product.price} 
                        prefix="NT$"
                        precision={2}
                        valueStyle={RecommendedProductPriceStyle}
                      />
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </RecommendedSection>
    </Container>
  );
}

export default HomePage;
