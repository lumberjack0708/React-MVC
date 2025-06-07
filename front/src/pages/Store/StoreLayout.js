import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppstoreOutlined, SolutionOutlined } from '@ant-design/icons';
import {
  StoreLayoutStyle,
  StoreSiderStyle,
  StoreSiderMenuStyle,
  StoreContentLayoutStyle,
  StoreContentStyle
} from '../../styles/storeStyles';

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
    <Layout style={StoreLayoutStyle}>
      <Sider width={200} style={StoreSiderStyle}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems} // 使用 'items' prop
          style={StoreSiderMenuStyle}
        />
      </Sider>
      <Layout style={StoreContentLayoutStyle}>
        <Content style={StoreContentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StoreLayout; 