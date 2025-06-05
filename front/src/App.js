// 匯入必要的 CSS 檔案和 React Router DOM 元件
import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// 匯入頁面級元件
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
// 匯入通知相關的 Provider
import { NotificationProvider } from './components/Notification';
// 匯入 Ant Design 元件
import { Layout, Menu, Badge, theme } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons';
// 匯入 Redux 相關函數和選擇器
import { useSelector } from 'react-redux';
import { selectCartItemCount } from './store/cartSlice';
// 匯入 normalize.css 標準化瀏覽器樣式
import 'normalize.css'; 

const { Header, Content } = Layout;

/**
 * @function AppContent
 * @description 應用程式的主要內容元件，包含導覽列、路由設定和頁尾。
 * @returns {JSX.Element} 返回應用程式內容的 JSX 結構。
 */
function AppContent() {
  const navigate = useNavigate();
  const cartItemCount = useSelector(selectCartItemCount);   // 使用 Redux 選擇器獲取購物車商品數量
  const { token } = theme.useToken();

  // 用於管理當前選中的菜單項
  const [current, setCurrent] = useState('/');

  useEffect(() => {
    // 根據當前 URL 路徑設置選中的菜單項
    const path = window.location.pathname;
    if (path === '/') setCurrent('home');
    else if (path === '/products') setCurrent('products');
    else if (path === '/cart') setCurrent('cart');
  }, []);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首頁</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">瀏覽全部商品</Link>,
    },
    {
      key: 'cart',
      icon: (
        <Badge count={cartItemCount} size="small">
          <ShoppingCartOutlined style={{ fontSize: '18px' }} />
        </Badge>
      ),
      label: <Link to="/cart">購物車</Link>,
    },
  ];

  const handleMenuClick = (e) => {
    setCurrent(e.key);
  };
  
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        width: '100%',
        background: token.colorPrimary,
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div 
          className="logo" 
          style={{ 
            width: '120px', 
            height: '31px', 
            position: 'absolute',
            left: '50px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} 
        />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            background: token.colorPrimary,
            borderBottom: 'none',
            justifyContent: 'center',
            flex: 1
          }}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: '16px' }}>
        <div className="site-content" style={{ minHeight: 280, padding: 24, background: token.colorBgContainer, borderRadius: '4px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}

/**
 * @function App
 * @description 應用程式的根元件。
 * @returns {JSX.Element} 返回包裹了 NotificationProvider 的 AppContent 元件。
 */
function App() {
  return (
    // 全域通知
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
