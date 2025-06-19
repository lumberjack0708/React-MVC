# 寵物用品電商系統 (Pet Department Store)

## 專案概覽

一個功能完整的寵物用品電商系統，採用前後端分離架構，提供完整的線上購物體驗和管理功能。

### 系統特色
- 🛒 **完整購物流程** - 商品瀏覽、購物車管理、訂單處理
- 👤 **用戶系統** - 註冊登入、個人資料管理、購買歷史
- 🏪 **管理後台** - 商品管理、訂單管理、用戶管理
- 🔐 **安全認證** - JWT Token 認證、權限控管
- 📱 **響應式設計** - 支援桌面和行動裝置
- ⚡ **樂觀更新** - 流暢的用戶交互體驗

## 技術架構

### 前端 (React)
- **框架**: React 19 + React Router 7
- **UI庫**: Ant Design 5 + Emotion CSS-in-JS
- **狀態管理**: Redux Toolkit + React Hooks
- **HTTP請求**: Axios + 攔截器自動處理認證

### 後端 (PHP)
- **語言**: PHP 8+ 
- **架構**: 自製 MVC 框架
- **資料庫**: MySQL + PDO
- **認證**: JWT + 權限控管系統 (RBAC)

## 快速開始

### 環境需求
- Node.js 18+
- PHP 8+
- MySQL/MariaDB
- XAMPP/LAMP 或類似環境

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd FinalProj
   ```

2. **設定後端**
   ```bash
   cd backend
   composer install
   # 導入資料庫: sql/petdeptstore.sql
   # 設定資料庫連線 (config.php)
   ```

3. **設定前端**
   ```bash
   cd front
   npm install
   npm start
   ```

4. **訪問系統**
   - 前端: http://localhost:3000
   - 後端API: http://localhost/FinalProj/backend/public

## 主要功能

### 一般用戶功能
- ✅ 用戶註冊與登入
- ✅ 商品瀏覽與搜尋
- ✅ 購物車管理
- ✅ 訂單建立與查詢
- ✅ 個人資料管理

### 管理員功能
- ✅ 商品管理 (CRUD)
- ✅ 訂單管理與狀態更新
- ✅ 用戶管理
- ✅ 統計資料查看

## 專案結構

```
FinalProj/
├── backend/              # PHP 後端 API
│   ├── app/             # MVC 核心程式碼
│   ├── public/          # 公開訪問點
│   └── routes/          # API 路由定義
├── front/               # React 前端應用
│   ├── src/             # 主要原始碼
│   ├── public/          # 靜態資源
│   └── package.json     # 前端依賴配置
└── sql/                 # 資料庫結構
```

## 資料庫設計

### 核心資料表
- `account` - 用戶帳戶資訊
- `product` - 商品資料
- `orders` / `order_detail` - 訂單主檔與明細
- `shopping_cart` / `cart_items` - 購物車系統
- `role` / `user_role` / `role_action` - 權限管理

## API 接口

### 認證相關
- `POST /doLogin` - 用戶登入
- `POST /newUser` - 用戶註冊

### 商品管理
- `GET /getProducts` - 取得商品列表
- `POST /newProduct` - 新增商品
- `PUT /updateProduct` - 更新商品
- `DELETE /removeProduct` - 刪除商品

### 購物車系統
- `GET /getCart` - 取得購物車內容
- `POST /addToCart` - 加入商品
- `PUT /updateCartItem` - 更新數量
- `DELETE /removeFromCart` - 移除商品

### 訂單處理
- `GET /getOrders` - 取得訂單列表
- `POST /newOrder` - 建立新訂單
- `PUT /updateOrderStatus` - 更新訂單狀態

## 開發指南

### 專案文檔
- 📖 **[前端技術文檔](frontInfo_v2.md)** - React 應用架構、元件設計、狀態管理詳解
- 📖 **[後端技術文檔](backendInfo.md)** - PHP API 架構、資料庫設計、認證系統詳解

### 其他文檔
- 🛒 **[購物車測試指南](CART_TESTING_GUIDE.md)** - 購物車功能測試步驟
- 🔧 **[管理介面指南](ADMIN_INTERFACE_GUIDE.md)** - 管理功能使用說明
- 📝 **[更新日誌](CHANGELOG.md)** - 版本更新記錄

### 開發規範
- 使用 Traditional Chinese 進行開發
- 優先使用現有框架，變數命名遵循框架規範
- 前後端使用 axios 和 qs 進行通信
- 保持 config.js 完整性，存儲重要的 base API URLs

## 系統截圖

### 主要介面
- 🏠 **首頁** - 歡迎頁面與推薦商品
- 🛍️ **商品頁面** - 商品瀏覽與篩選
- 🛒 **購物車** - 商品管理與結帳
- 👤 **個人中心** - 用戶資料與購買歷史

### 管理後台
- 📦 **商品管理** - 商品CRUD操作
- 📋 **訂單管理** - 訂單狀態控制
- 👥 **用戶管理** - 帳戶資訊管理

## 測試帳號

### 一般用戶
- 帳號: `user001`
- 密碼: `password123`

### 管理員
- 帳號: `admin001`
- 密碼: `admin123`

## 部署說明

### 生產環境配置
1. 設定 PHP 環境變數
2. 配置 MySQL 資料庫連線
3. 建置 React 前端 (`npm run build`)
4. 設定 Web 伺服器 (Apache/Nginx)

### 安全性設定
- 使用 HTTPS 加密傳輸
- 設定適當的 CORS 政策
- 定期更新 JWT Secret Key
- 啟用資料庫連線加密

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/新功能`)
3. 提交變更 (`git commit -am '新增某功能'`)
4. 推送分支 (`git push origin feature/新功能`)
5. 建立 Pull Request

## 授權條款

本專案採用 MIT 授權條款。

## 聯絡資訊

如有任何問題或建議，請透過以下方式聯絡：
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](link-to-issues)

---

*最後更新: 2025年1月* 