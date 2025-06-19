// 匯入必要的 CSS 檔案和 React Router DOM 元件
import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// 匯入頁面級元件
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import UserProfilePage from './pages/UserProfilePage';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
// 匯入店家管理頁面
import StoreLayout from './pages/Store/StoreLayout';
import ProductManagement from './pages/Store/ProductManagement';
import OrderManagement from './pages/Store/OrderManagement';
// 匯入管理員專用布局
import AdminLayout from './pages/Store/AdminLayout';
// 匯入通知相關的 Provider
import { NotificationProvider } from './components/Notification';
// 匯入 Ant Design 元件
import { Layout, Menu, Badge, theme, Button, App as AntApp, Dropdown } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, ShoppingOutlined, UserOutlined, ShopOutlined, CalendarOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
// 匯入登入模態框組件
import LoginModal from './components/LoginModal';
// 匯入 Redux 相關函數和選擇器
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemCount, fetchCartStatistics } from './store/cartSlice';
// 匯入 normalize.css 標準化瀏覽器樣式
import 'normalize.css'; 
// 引入新的工具函式
import Request from './utils/Request';
import { getToken, removeToken, setToken } from './utils/auth';
import { getApiUrl, API_CONFIG } from './config';

const { Header, Content } = Layout;

/**
 * @function AppContent
 * @description 應用程式的主要內容元件，包含導覽列、路由設定和頁尾。
 * @returns {JSX.Element} 返回應用程式內容的 JSX 結構。
 */
function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);   // 使用 Redux 選擇器獲取購物車商品數量
  const { token } = theme.useToken();

  // 用於管理當前選中的菜單項
  const [current, setCurrent] = useState('/');
  
  // 登入相關狀態
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [user, setUser] = useState(null); // 用戶資訊
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // 新增：用於表示正在檢查認證

  useEffect(() => {
    // 根據當前 URL 路徑設置選中的菜單項
    const path = window.location.pathname;
    if (path === '/') setCurrent('home');
    else if (path.includes('/products')) setCurrent('products');
    else if (path.includes('/purchase-history')) setCurrent('purchase-history');
    else if (path.includes('/cart')) setCurrent('cart');
    else if (path.includes('/store')) setCurrent('store');

    // === 修正：App 啟動時檢查 Token ===
    const checkAuth = async () => {
      const authToken = getToken();
      if (!authToken) {
        setIsAuthChecking(false);
        return;
      }

      try {
        // 直接呼叫後端根 API 以驗證 token 是否有效
        const res = await Request().get(API_CONFIG.baseURL);
        const response = res.data;
        if (response.status === 200) {
          // Token 有效，更新 token 和使用者狀態
          if (response.token) {
            setToken(response.token);
          }
          if (response.user) {
            setUser(response.user);
            // 只有非管理員用戶才載入購物車統計
            if (response.user.role_id !== 1) {
              dispatch(fetchCartStatistics(response.user.account_id));
            }
          }
          setIsLoggedIn(true);
        } else {
          // Token 無效或過期
          removeToken();
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        // API 請求失敗，清除認證狀態
        console.error('認證檢查失敗:', error);
        removeToken();
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsAuthChecking(false); // 結束檢查
      }
    };

    checkAuth();
  }, [dispatch]);

  // 定期刷新購物車統計（每30秒）- 僅對非管理員用戶
  useEffect(() => {
    if (!user?.account_id || user?.role_id === 1) return;

    const interval = setInterval(() => {
      dispatch(fetchCartStatistics(user.account_id));
    }, 30000); // 30秒

    return () => clearInterval(interval);
  }, [user, dispatch]);

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
      key: 'purchase-history',
      icon: <CalendarOutlined />,
      label: <Link to="/purchase-history">購買紀錄</Link>,
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
  
  const handleUserIconClick = () => {
    navigate('/user-profile');
  };
  
  const handleStoreIconClick = () => {
    navigate('/store/products');
  };

  // 登入相關處理函數
  const handleLoginClick = () => {
    setLoginModalVisible(true);
  };

  const handleLoginSuccess = (loginResponse) => {
    // loginResponse 已經包含了 user 和 token
    // token 已在 LoginModal 中設定
    setUser(loginResponse.user);
    setIsLoggedIn(true);
    console.log('登入成功，用戶資料:', loginResponse.user);
    
    // 登入成功後，如果是管理員，直接跳轉到管理界面
    if (loginResponse.user?.role_id === 1) {
      navigate('/admin/products');
    } else {
      // 普通用戶立即獲取購物車統計
      if (loginResponse.user?.account_id) {
        dispatch(fetchCartStatistics(loginResponse.user.account_id));
      }
    }
  };

  const handleLogout = () => {
    removeToken(); // 從 localStorage 移除 token
    setUser(null);
    setIsLoggedIn(false);
    console.log('用戶已登出');
    
    // 登出時清空購物車統計
    dispatch(fetchCartStatistics(null));
    
    // 導航到首頁
    navigate('/');
  };

  // 新增：如果正在檢查認證，可以顯示一個 Loading 畫面
  if (isAuthChecking) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>正在載入...</div>;
  }

  // 如果用戶是管理員 (role_id === 1)，顯示專門的管理界面
  if (isLoggedIn && user?.role_id === 1) {
    // 如果管理員訪問非管理路徑，自動重定向
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/admin')) {
      navigate('/admin/products', { replace: true });
      return null;
    }

    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<ProductManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
        {/* 處理其他路徑 */}
        <Route path="*" element={<AdminLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<ProductManagement />} />
        </Route>
      </Routes>
    );
  }

  // 普通用戶界面
  return (
    <Layout className="layout" style={{ 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: token.colorPrimary,
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '64px',
        flexShrink: 0
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
        <div style={{
          position: 'absolute',
          right: '50px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {isLoggedIn ? (
            <>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      icon: <UserOutlined />,
                      label: '個人資料',
                      onClick: handleUserIconClick,
                    },
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '登出',
                      onClick: handleLogout,
                    },
                  ],
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<UserOutlined />}
                  title={`歡迎，${user?.full_name || '用戶'}`}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                />
              </Dropdown>
            </>
          ) : (
            <>
              <Button 
                type="primary" 
                shape="circle" 
                icon={<LoginOutlined />}
                onClick={handleLoginClick}
                title="會員登入"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              />
              <Button 
                type="primary" 
                shape="circle" 
                icon={<UserOutlined />}
                onClick={handleUserIconClick}
                title="用戶資訊"
              />
            </>
          )}
        </div>
      </Header>
      <Content style={{ 
        padding: '0 50px', 
        marginTop: '16px',
        height: 'calc(100vh - 80px)',
        overflow: 'auto'
      }}>
        <div className="site-content" style={{ 
          minHeight: '100%', 
          padding: 24, 
          background: token.colorBgContainer, 
          borderRadius: '4px'
        }}>
          <Routes>
            <Route path="/" element={<HomePage user={user} isLoggedIn={isLoggedIn} onLoginRequest={handleLoginClick} />} />
            <Route path="/products" element={<ProductsPage user={user} isLoggedIn={isLoggedIn} onLoginRequest={handleLoginClick} />} />
            <Route path="/purchase-history" element={<PurchaseHistoryPage user={user} />} />
            <Route path="/cart" element={<CartPage user={user} />} />
            <Route path="/user-profile" element={<UserProfilePage user={user} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Content>
      
      {/* 登入模態框 */}
      <LoginModal
        visible={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        onSuccess={handleLoginSuccess}
      />
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
      <AntApp> {/* Ant Design v5 App Wrapper */}
        <AppContent />
      </AntApp>
    </NotificationProvider>
  );
}

export default App;
