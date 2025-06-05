// filepath: g:\CodeBase\React-FinalProj\src\index.js
// 匯入 React 核心庫
import React from 'react';
// 匯入 ReactDOM 用於將 React 元件渲染到 DOM
import ReactDOM from 'react-dom/client';
// 匯入全域 CSS 樣式
import './index.css';
// 匯入 Ant Design 全域樣式
// 注意：Ant Design v5 不再需要顯式導入 CSS 文件
// import 'antd/dist/reset.css';
// 匯入應用程式的根元件
import App from './App';
// 匯入用於測量應用程式性能的函式 (可選)
import reportWebVitals from './reportWebVitals';
// 匯入 BrowserRouter 用於客戶端路由
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
// 匯入 Ant Design 元件和自定義主題配置
import { ConfigProvider } from 'antd';
import { themeConfig } from './styles/styles';

// 建立 React 應用程式的根節點
// ReactDOM.createRoot 是 React 18+ 的推薦 API，用於啟用並行功能
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染應用程式
root.render(
  // React.StrictMode 是一個用於突顯應用程式中潛在問題的工具。
  // 它不會渲染任何可見的 UI，只對其後代元素啟用額外的檢查和警告 (僅在開發模式下)。
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={themeConfig}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

// 如果你想開始測量應用程式的性能，可以傳遞一個函式來記錄結果
// (例如: reportWebVitals(console.log))
// 或將結果發送到分析端點。了解更多: https://bit.ly/CRA-vitals
reportWebVitals();
