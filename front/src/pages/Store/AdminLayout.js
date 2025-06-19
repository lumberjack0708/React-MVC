import React from 'react';
import { Layout, Menu, Typography, Button, Space } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppstoreOutlined, SolutionOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { removeToken } from '../../utils/auth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    onLogout();
    navigate('/');
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/admin/products')) {
      return ['products'];
    }
    if (path.includes('/admin/orders')) {
      return ['orders'];
    }
    return ['products'];
  };

  const menuItems = [
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/products">商品管理</Link>,
    },
    {
      key: 'orders',
      icon: <SolutionOutlined />,
      label: <Link to="/admin/orders">訂單管理</Link>,
    },
  ];

  return (
    <Layout style={{ 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <Header style={{
        background: '#001529',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        height: '64px',
        flexShrink: 0
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          寵物商店管理系統
        </Title>
        <Space>
          <span style={{ color: 'white' }}>
            <UserOutlined /> 管理員：{user?.full_name || '未知'}
          </span>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            登出
          </Button>
        </Space>
      </Header>
      
      <Layout style={{ 
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        <Sider 
          width={200} 
          style={{ 
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            items={menuItems}
            style={{ 
              height: '100%', 
              borderRight: 0,
              marginTop: '16px',
              overflow: 'hidden'
            }}
          />
        </Sider>
        
        <Layout style={{ 
          padding: '16px',
          height: '100%',
          overflow: 'hidden'
        }}>
          <Content style={{
            background: '#fff',
            padding: '20px',
            margin: 0,
            height: '100%',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 