// 導入必要的庫
import { theme } from 'antd';
import styled from '@emotion/styled';

/**
 * @description 專案主要樣式與主題設定。
 *              使用 Ant Design 主題系統和部分保留的 Emotion 樣式組件。
 */

// 自定義主題配置
export const themeConfig = {
  token: {
    colorPrimary: '#2B2118',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1677ff',
    borderRadius: 4,
    fontSize: 14,
  },
};

// 全域樣式（保留使用 Emotion）
export const globalStyles = `
  body {
    background-color: #f7f7f7;
    color: rgba(0, 0, 0, 0.88);
    transition: all 0.3s ease;
    font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
`;

// 使用 Emotion 的部分自定義組件（保留少部分 CSS-in-JS）

// 容器樣式
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

// 標題樣式（較少使用 Ant Design 無法直接替代的樣式）
export const Heading = styled.h1`
  color: #2B2118;
  margin-bottom: 16px;
  font-weight: 600;
`;

// 圖片容器樣式
export const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

// 產品圖片樣式
export const ProductImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

// 價格標籤樣式
export const PriceTag = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #2B2118;
`;

// 文件已由之前的 Emotion styled-components 改為主要使用 Ant Design 元件
// 只保留少數必要的 Emotion 樣式
