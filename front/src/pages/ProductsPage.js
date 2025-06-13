/* global Qs */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCartStatistics } from '../store/cartSlice';
import { getApiUrl, API_CONFIG } from '../config';
import { useNotification } from '../components/Notification';
import ProductDetailModal from '../components/ProductDetailModal';
import { Row, Col, Card, Typography, Button, Select, Space, Statistic, Badge, Radio, Tooltip, Spin } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, FilterOutlined, SortAscendingOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Container, Heading } from '../styles/styles';
import {
  LoadingContainer,
  ErrorContainer,
  FilterCardStyle,
  IconStyle,
  StatisticValueStyle,
  RightAlignContainer,
  ProductImageContainer,
  ProductImageStyle,
  ProductTitle,
  LoadingDetailContainer
} from '../styles/pageStyles';
import { getProductImage } from '../assets/images/index';
import Request from '../utils/Request';

const { Text } = Typography;
const { Option } = Select;

/**
 * @function ProductsPage
 * @description 商品列表頁面，顯示所有商品並可加入購物車。
 * @returns {JSX.Element} 返回商品頁面的 JSX 結構。
 */

function ProductsPage({ user, isLoggedIn, onLoginRequest }) {
  const { notify } = useNotification();
  
  const dispatch = useDispatch();  // Redux dispatch
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 篩選狀態
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  
  // 產品詳情模態框狀態
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  // 從後端 API 獲取產品數據
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await Request().post(getApiUrl('getProducts'), Qs.stringify({}));
        // 確保商品資料包含必要的欄位
        const mappedProducts = (response.data.result || []).map(product => ({
          ...product,
          id: product.product_id,      // 統一使用id
          product_id: product.product_id  // 保留原始product_id
        }));
        setProducts(mappedProducts);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '載入產品時發生未知錯誤';
        setError(errorMessage);
        notify.error('載入產品失敗', errorMessage);
        console.error("載入產品失敗:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [notify]);
  
  // 處理查看詳情 - 從後端獲取最新的產品資訊
  const fetchProductDetails = async (productId) => {
    setIsModalLoading(true);
    setSelectedProduct(null); // 清除舊的選擇
    try {
      const response = await Request().post(getApiUrl('getProducts'), Qs.stringify({ pid: productId }));
      if (response.data.status === 200) {
        setSelectedProduct(response.data.result[0]);
      } else {
        throw new Error(response.data.message || '找不到該產品的詳細資訊');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '獲取產品詳情失敗';
      notify.error('獲取詳情失敗', errorMessage);
      console.error("獲取產品詳情失敗:", err);
    } finally {
      setIsModalLoading(false);
    }
  };
  
  // 添加商品到購物車的處理函數
  const handleAddToCart = async (product) => {
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

    try {
      // 使用後端API添加到購物車
      const cartService = (await import('../services/cartService')).default;
      const response = await cartService.addToCart(
        user.account_id, 
        product.id || product.product_id, 
        1
      );

      if (response.data.status === 200) {
        notify.success(
          '已加入購物車', 
          `${product.name} 已成功加入您的購物車！`
        );
        // 刷新 Redux 購物車統計
        dispatch(fetchCartStatistics(user.account_id));
      } else {
        notify.error(
          '加入購物車失敗', 
          response.data.message || '無法將商品加入購物車，請稍後再試。'
        );
      }
    } catch (error) {
      console.error('加入購物車錯誤:', error);
      notify.error(
        '網路錯誤', 
        '無法連接到伺服器，請檢查您的網路連線。'
      );
    }
  };
  
  // 處理排序改變
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  
  // 篩選產品
  let filteredProducts = categoryFilter === 'all' 
    ? [...products] 
    : [...products].filter(product => product.category === categoryFilter);

  // 排序產品
  if (sortOrder === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // 類別選項
  const categoryOptions = [
    { value: 'all', label: '所有類別' },
    { value: 'food', label: '食品' },
    { value: 'toy', label: '玩具' },
    { value: 'accessories', label: '配件' }
  ];

  if (loading) {
    return <LoadingContainer><Spin size="large" /> <Typography.Title level={3}>產品載入中...</Typography.Title></LoadingContainer>;
  }

  if (error && products.length === 0) { // 只在完全沒有產品數據時顯示主要錯誤
    return <ErrorContainer><Typography.Title level={3} type="danger">載入產品時發生錯誤: {error}</Typography.Title></ErrorContainer>;
  }

  return (
    <Container>
      <Heading>瀏覽全部商品</Heading>
      
      {/* 篩選器UI */}
      <Card style={FilterCardStyle}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={9}>
            <Space align="center">
              <FilterOutlined style={IconStyle} />
              <Text strong>按類別篩選：</Text>
              <Select 
                value={categoryFilter} 
                onChange={setCategoryFilter}
                style={{ width: 150 }}
              >
                {categoryOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} lg={10}>
            <Space size="middle" style={{ display: 'flex', flexWrap: 'nowrap' }}>
              <SortAscendingOutlined style={IconStyle} />
              <Text strong>排序：</Text>
              <Radio.Group 
                value={sortOrder} 
                onChange={handleSortChange}
                optionType="button"
                buttonStyle="solid"
                options={[
                  { label: '預設', value: 'default' },
                  { label: '價格↑', value: 'price-asc' },
                  { label: '價格↓', value: 'price-desc' },
                ]}
              />
            </Space>
          </Col>
          
          <Col xs={24} lg={5}>
            <RightAlignContainer>
              <Tooltip title="商品總數">
                <Statistic 
                  title={
                    <Space>
                      <AppstoreOutlined style={IconStyle} />
                      <Text strong>商品數量</Text>
                    </Space>
                  }
                  value={filteredProducts.length} 
                  valueStyle={StatisticValueStyle}
                                  prefix={<UnorderedListOutlined />}
                  suffix="件"
                />
              </Tooltip>
            </RightAlignContainer>
          </Col>
        </Row>
      </Card>
      
      {/* 產品列表 */}
      <Row gutter={[16, 16]}>
        {filteredProducts.map(product => (
          <Col xs={24} sm={12} md={8} key={product.id || product.product_id}>
            <Badge.Ribbon 
              text={
                product.category === 'food' ? '食品' :
                product.category === 'toy' ? '玩具' : '配件'
              } 
              color={
                product.category === 'food' ? 'green' :
                product.category === 'toy' ? 'geekblue' : 'volcano'
              }
            >
              <Card
                hoverable
                cover={
                  <ProductImageContainer>
                    <img
                      alt={product.name}
                      src={
                        product.image_url
                          ? `${API_CONFIG.assetBaseURL}public/${product.image_url}`
                          : getProductImage(product.category, product.name)
                      }
                      style={ProductImageStyle}
                    />
                  </ProductImageContainer>
                }
                actions={[
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />}
                    onClick={() => fetchProductDetails(product.id)} 
                  >
                    查看詳情
                  </Button>,
                  <Button 
                    type="text" 
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)} 
                  >
                    加入購物車
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <ProductTitle>
                      {product.name || '未命名產品'}
                    </ProductTitle>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Statistic
                        value={product.price}
                        prefix="NT$"
                        precision={2}
                        valueStyle={StatisticValueStyle}
                      />
                      <Text type="secondary">庫存 {product.stock} 件</Text>
                    </Space>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
      
      {/* 產品詳情模態框 */}
      {isModalLoading && <LoadingDetailContainer><Spin tip="載入產品詳情中..." /></LoadingDetailContainer>}
      {!isModalLoading && selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => handleAddToCart(selectedProduct)}
        />
      )}
    </Container>
  );
}

export default ProductsPage;
