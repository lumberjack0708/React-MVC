/* global axios, Qs */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { getApiUrl, API_CONFIG } from '../config';
import { useNotification } from '../components/Notification';
import ProductDetailModal from '../components/ProductDetailModal';
// 引入 Ant Design 元件
import { Row, Col, Card, Typography, Button, Select, Space, Statistic, Badge, Radio, Tooltip, Spin } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, FilterOutlined, SortAscendingOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
// 引入保留的 Emotion 樣式組件
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

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * @function ProductsPage
 * @description 商品列表頁面，顯示所有商品並可加入購物車。
 * @returns {JSX.Element} 返回商品頁面的 JSX 結構。
 */

function ProductsPage() {
  const { notify } = useNotification();
  
  const dispatch = useDispatch(); // 使用 Redux dispatch
  
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
    const loadProducts = async () => {
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
            image_url: p.image_url,
          }));
          setProducts(formattedProducts);
        } else {
          throw new Error(response.data.message || '無法獲取產品資料');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || '載入產品時發生未知錯誤';
        setError(errorMessage);
        notify.error('載入產品失敗', errorMessage);
        console.error("載入產品失敗:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [notify]);
  
  // 處理查看詳情 - 從後端獲取最新的產品資訊
  const handleViewDetails = async (productId) => {
    setIsModalLoading(true);
    setSelectedProduct(null); // 清除舊的選擇
    try {
      const response = await axios.post(getApiUrl('getProducts'), Qs.stringify({ pid: productId }));
      if (response.data && response.data.status === 200 && response.data.result.length > 0) {
        const p_detail = response.data.result[0];
        // 假設單一產品查詢也返回 pid, p_name 等 (或 product_id 如果後端修正了 SQL 且返回的是 product_id)
        // 若後端 getProduct($pid) 返回的是 product_id, 這裡的 id 也應對應調整
        const detailedProduct = {
          id: p_detail.product_id,
          name: p_detail.name,
          price: parseFloat(p_detail.price),
          category: p_detail.category,
          stock: parseInt(p_detail.stock, 10),
          description: p_detail.description || `這是 ${p_detail.name} 的詳細介紹。`, // 假設有 description 欄位
          imageSource: getProductImage(p_detail.category, p_detail.name) || '/placeholder.png'
        };
        setSelectedProduct(detailedProduct);
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
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    notify.success(
      '已加入購物車', 
      `${product.name} 已成功加入您的購物車！`
    );
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
          <Col xs={24} sm={12} md={8} key={product.id}>
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
                    onClick={() => handleViewDetails(product.id)} 
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
