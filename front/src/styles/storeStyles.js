import styled from '@emotion/styled';

// 店家管理樣式

// 店家佈局樣式
export const StoreLayoutStyle = {
  minHeight: 'calc(100vh - 220px)',
  background: 'transparent'
};

// 側邊欄樣式
export const StoreSiderStyle = {
  background: '#fff',
  borderRadius: '4px'
};

// 側邊欄選單樣式
export const StoreSiderMenuStyle = {
  height: '100%',
  borderRight: 0
};

// 店家內容佈局樣式
export const StoreContentLayoutStyle = {
  padding: '0 0 0 24px',
  background: 'transparent'
};

// 店家內容樣式
export const StoreContentStyle = {
  padding: '24px',
  margin: '0',
  minHeight: '280px',
  background: '#fff',
  borderRadius: '4px'
};

// 商品管理標題容器
export const ProductManagementHeaderContainer = styled.div`
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 商品管理標題
export const ProductManagementTitle = styled.h2`
  margin: 0;
`;

// 商品圖片樣式
export const ProductManagementImageStyle = {
  width: '50px',
  height: '50px',
  objectFit: 'cover'
};

// 訂單管理選擇器樣式
export const OrderManagementSelectStyle = {
  width: '120px'
}; 