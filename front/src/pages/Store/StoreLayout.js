import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppstoreOutlined, SolutionOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

// 將 Menu 項目移出組件，使其成為一個靜態陣列
const menuItems = [
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: <Link to="/store/products">商品管理</Link>,
  },
  {
    key: 'orders',
    icon: <SolutionOutlined />,
    label: <Link to="/store/orders">訂單管理</Link>,
  },
];

const StoreLayout = () => {
  const location = useLocation();

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/store/products')) {
      return ['products'];
    }
    if (path.includes('/store/orders')) {
      return ['orders'];
    }
    return ['products'];
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 220px)', background: 'transparent' }}>
      <Sider width={200} style={{ background: '#fff', borderRadius: '4px' }}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems} // 使用 'items' prop
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ padding: '0 0 0 24px', background: 'transparent' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
            borderRadius: '4px',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StoreLayout; 