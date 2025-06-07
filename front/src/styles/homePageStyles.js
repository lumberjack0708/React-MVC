import styled from '@emotion/styled';

// 首頁樣式

// 歡迎卡片
// 歡迎卡片樣式
export const WelcomeCardStyle = {
  marginBottom: '30px',
  textAlign: 'center'
};

// 歡迎卡片內容空間
export const WelcomeCardSpace = styled.div`
  margin-top: 20px;
`;

// 推薦商品區域
export const RecommendedSection = styled.div`
  margin-top: 30px;
`;

// 推薦商品標題
export const RecommendedTitle = styled.h3`
  margin-bottom: 20px;
  text-align: center;
`;

// 載入推薦商品容器
export const LoadingRecommendedContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

// 錯誤推薦商品容器
export const ErrorRecommendedContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

// 空推薦商品容器
export const EmptyRecommendedContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

// 推薦商品圖片樣式
export const RecommendedProductImageStyle = {
  height: '200px',
  objectFit: 'contain',
  padding: '10px'
};

// 推薦商品標題
export const RecommendedProductTitle = styled.h4`
  min-height: 56px;
`;

// 推薦商品價格樣式
export const RecommendedProductPriceStyle = {
  color: '#2B2118',
  fontSize: '18px'
}; 