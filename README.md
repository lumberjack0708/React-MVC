# 🐾 寵物百貨電商系統

一個功能完整的寵物用品電商平台，提供商品瀏覽、購物車、訂單管理等功能。

## 📋 目錄

- [專案介紹](#專案介紹)
- [使用者故事](#使用者故事)
- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [系統需求](#系統需求)
- [安裝指南](#安裝指南)
- [使用說明](#使用說明)
- [API 文件](#api-文件)
- [資料庫結構](#資料庫結構)
- [專案結構](#專案結構)
- [開發團隊](#開發團隊)

## 🎯 專案介紹

寵物百貨電商系統是一個專為寵物用品銷售設計的全端 Web 應用程式。系統提供直觀的使用者介面，讓顧客能夠輕鬆瀏覽商品、管理購物車、下訂單，同時為店家提供完整的後台管理功能。

## 🧑‍💻 使用者故事

- **一般訪客**：希望不需登入即可瀏覽所有商品，了解平台提供的產品種類。
- **註冊會員**：可以將商品加入購物車並下單，並查詢個人購買紀錄。
- **店家管理者**：能在後台新增、編輯與刪除商品，掌握訂單處理流程。

## ✨ 功能特色

### 🛒 顧客端功能
- **商品瀏覽**：支援分類篩選、價格排序
- **商品詳情**：詳細的商品資訊展示
- **購物車管理**：新增、修改、刪除商品
- **訂單系統**：完整的下單流程
- **購買紀錄**：查看歷史訂單和統計資料
- **用戶資料管理**：編輯個人資訊

### 🏪 店家端功能
- **商品管理**：新增、編輯、刪除商品
- **訂單管理**：查看訂單詳情、更新訂單狀態
- **庫存管理**：自動庫存扣減和回滾

### 🎨 使用者體驗
- **響應式設計**：支援各種裝置尺寸
- **即時通知**：操作回饋和錯誤提示
- **直觀介面**：使用 Ant Design 設計系統

## 🛠 技術架構

### 前端技術
- **React 19.1.0** - 使用者介面框架
- **Redux Toolkit** - 狀態管理
- **React Router DOM** - 路由管理
- **Ant Design 5.25.3** - UI 組件庫
- **Emotion** - CSS-in-JS 樣式解決方案
- **Axios** - HTTP 客戶端
- **Day.js** - 日期處理

### 後端技術
- **PHP** - 伺服器端語言
- **MySQL** - 資料庫
- **RESTful API** - API 設計架構

### 開發工具
- **Create React App** - 前端開發環境
- **ESLint** - 程式碼品質檢查
- **XAMPP** - 本地開發環境

## 💻 系統需求

- **Node.js** 16.0.0 或更高版本
- **npm** 8.0.0 或更高版本
- **PHP** 7.4 或更高版本
- **MySQL** 5.7 或更高版本
- **Apache** 伺服器

## 🚀 安裝指南

### 1. 克隆專案
```bash
git clone [repository-url]
cd FinalProj
```

### 2. 後端設置

#### 安裝 XAMPP
1. 下載並安裝 [XAMPP](https://www.apachefriends.org/)
2. 啟動 Apache 和 MySQL 服務

#### 設置資料庫
1. 開啟 phpMyAdmin (http://localhost/phpmyadmin)
2. 建立新資料庫 `petdeptstore`
3. 匯入資料庫結構：
```sql
-- 執行 backend/sql/petdeptstore.sql 檔案
```

#### 配置後端
1. 將專案放置於 XAMPP 的 htdocs 目錄
2. 確保後端 API 可透過 http://localhost/FinalProj/backend/public/index.php 存取

### 3. 前端設置

```bash
# 進入前端目錄
cd front

# 安裝依賴套件
npm install

# 安裝新增的 dayjs 套件
npm install dayjs@^1.11.10

# 啟動開發伺服器
npm start
```

前端應用將在 http://localhost:3000 啟動

## 📖 使用說明

### 顧客端操作

1. **瀏覽商品**
   - 訪問首頁查看推薦商品
   - 點擊「瀏覽全部商品」查看完整商品列表
   - 使用分類篩選和價格排序功能

2. **購物車操作**
   - 點擊商品的「加入購物車」按鈕
   - 在購物車頁面調整商品數量
   - 點擊「結帳」完成訂單

3. **查看訂單**
   - 在「購買紀錄」頁面查看所有訂單
   - 點擊「查看詳情」查看訂單明細
   - 可取消待處理的訂單

### 店家端操作

1. **商品管理**
   - 點擊右上角店家圖示進入管理介面
   - 在「商品管理」頁面新增、編輯或刪除商品
   - 支援圖片上傳功能

2. **訂單管理**
   - 在「訂單管理」頁面查看所有訂單
   - 更新訂單狀態（待處理 → 處理中 → 已出貨）
   - 查看訂單詳細內容

## 📡 API 文件

### 商品相關
- `GET/POST /backend/public/index.php?action=getProducts` - 獲取商品列表
- `POST /backend/public/index.php?action=newProduct` - 新增商品
- `POST /backend/public/index.php?action=updateProduct` - 更新商品
- `POST /backend/public/index.php?action=removeProduct` - 刪除商品

### 訂單相關
- `POST /backend/public/index.php?action=newOrder` - 建立新訂單
- `POST /backend/public/index.php?action=getOrders` - 獲取訂單列表
- `POST /backend/public/index.php?action=getOrderDetail` - 獲取訂單詳情
- `POST /backend/public/index.php?action=updateOrderStatus` - 更新訂單狀態
- `POST /backend/public/index.php?action=removeOrder` - 取消訂單

### 用戶相關
- `POST /backend/public/index.php?action=getUsers` - 獲取用戶資訊
- `POST /backend/public/index.php?action=updateUser` - 更新用戶資訊

## 🗄 資料庫結構

### 主要資料表

#### `product` - 商品表
- `product_id` - 商品編號（主鍵）
- `name` - 商品名稱
- `price` - 售價
- `stock` - 庫存數量
- `category` - 商品類別
- `image_url` - 商品圖片路徑

#### `orders` - 訂單表
- `order_id` - 訂單編號（主鍵）
- `account_id` - 帳戶編號（外鍵）
- `order_time` - 訂單時間
- `status` - 訂單狀態

#### `order_detail` - 訂單明細表
- `order_id` - 訂單編號（外鍵）
- `product_id` - 商品編號（外鍵）
- `quantity` - 訂購數量

#### `account` - 帳戶表
- `account_id` - 帳戶編號（主鍵）
- `email` - 電子郵件
- `full_name` - 姓名
- `addr` - 地址
- `birth` - 生日

## 🪝 React Hooks 使用說明

本專案廣泛使用了 React Hooks 來管理組件狀態和副作用。以下是各個 Hook 的詳細使用說明：

### 📊 狀態管理 Hooks

#### `useState`
用於管理組件的本地狀態，在多個頁面中都有使用：

**ProductsPage.js**
```javascript
const [products, setProducts] = useState([]);           // 商品列表狀態
const [loading, setLoading] = useState(true);           // 載入狀態
const [error, setError] = useState(null);               // 錯誤狀態
const [categoryFilter, setCategoryFilter] = useState('all');  // 分類篩選狀態
const [sortOrder, setSortOrder] = useState('default');  // 排序狀態
const [selectedProduct, setSelectedProduct] = useState(null);  // 選中的商品
```

**CartPage.js**
```javascript
const [loading, setLoading] = useState(false);          // 結帳載入狀態
const [error, setError] = useState(null);               // 錯誤狀態
```

**HomePage.js**
```javascript
const [featuredProducts, setFeaturedProducts] = useState([]);  // 推薦商品
const [loading, setLoading] = useState(true);           // 載入狀態
const [error, setError] = useState(null);               // 錯誤狀態
```

**UserProfilePage.js**
```javascript
const [loading, setLoading] = useState(true);           // 載入狀態
const userId = 1;  // 用戶 ID（暫時寫死）
```

**Notification.js**
```javascript
const [notifications, setNotifications] = useState([]); // 通知列表狀態
```

**ProductManagement.js**
```javascript
const [products, setProducts] = useState([]);           // 商品管理列表
const [loading, setLoading] = useState(false);          // 載入狀態
const [isModalVisible, setIsModalVisible] = useState(false);  // 模態框顯示狀態
const [editingProduct, setEditingProduct] = useState(null);   // 編輯中的商品
```

#### `useEffect`
用於處理副作用，如 API 呼叫、事件監聽等：

**資料載入**
```javascript
// ProductsPage.js - 載入商品列表
useEffect(() => {
  const loadProducts = async () => {
    // API 呼叫邏輯
  };
  loadProducts();
}, [notify]);

// HomePage.js - 載入推薦商品
useEffect(() => {
  const loadFeaturedProducts = async () => {
    // API 呼叫邏輯
  };
  loadFeaturedProducts();
}, [notify]);

// UserProfilePage.js - 載入用戶資料
useEffect(() => {
  const fetchUserData = async () => {
    // API 呼叫邏輯
  };
  fetchUserData();
}, [userId, form, notify]);

// ProductManagement.js - 載入商品管理資料
useEffect(() => {
  fetchProducts();
}, []);
```

**自動清理和定時器**
```javascript
// Notification.js - 自動關閉通知
useEffect(() => {
  const timer = setTimeout(() => {
    onClose(id);
  }, 5000);
  
  return () => clearTimeout(timer);  // 清理定時器
}, [id, onClose]);
```

**URL 路徑監聽**
```javascript
// App.js - 根據 URL 設置選中的菜單項
useEffect(() => {
  const path = window.location.pathname;
  if (path === '/') setCurrent('home');
  else if (path.includes('/products')) setCurrent('products');
  // ... 其他路徑判斷
}, []);
```

**表單資料同步**
```javascript
// ProductForm.js - 同步表單初始值
useEffect(() => {
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      price: parseInt(initialValues.price, 10),
    });
  } else {
    form.resetFields();
  }
}, [form, initialValues]);
```

### 🔄 Redux Hooks

#### `useSelector`
用於從 Redux store 中選取狀態：

```javascript
// App.js - 獲取購物車商品數量
const cartItemCount = useSelector(selectCartItemCount);

// CartPage.js - 獲取購物車項目和總價
const cartItems = useSelector(selectCartItems);
const totalPrice = useSelector(selectTotalPrice);
```

#### `useDispatch`
用於發送 Redux actions：

```javascript
// ProductsPage.js, HomePage.js, CartPage.js
const dispatch = useDispatch();

// 使用範例
dispatch(addToCart(product));           // 添加商品到購物車
dispatch(updateQuantity({ id, quantity }));  // 更新商品數量
dispatch(removeFromCart(id));           // 移除商品
dispatch(clearCart());                  // 清空購物車
```

### 🧭 路由 Hooks

#### `useNavigate`
用於程式化導航：

```javascript
// App.js, HomePage.js, CartPage.js
const navigate = useNavigate();

// 使用範例
navigate('/products');                  // 導航到商品頁面
navigate('/user-profile');              // 導航到用戶資料頁面
navigate('/store/products');            // 導航到店家管理頁面
```

### 🎯 Context Hooks

#### `useContext`
用於使用 React Context：

```javascript
// Notification.js - 自定義通知 Hook
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
```

### 📋 表單 Hooks

#### Ant Design Form Hooks
```javascript
// UserProfilePage.js, ProductManagement.js
const [form] = Form.useForm();          // 表單實例

// 使用範例
form.setFieldsValue(userData);          // 設置表單值
form.resetFields();                     // 重置表單
form.validateFields();                  // 驗證表單
```

### 🎨 主題 Hooks

#### `theme.useToken`
```javascript
// App.js - 獲取 Ant Design 主題 token
const { token } = theme.useToken();
```

### 🔧 自定義 Hooks

#### `useNotification`
專案中實作的自定義 Hook，用於統一管理通知系統：

```javascript
// 在各個組件中使用
const { notify } = useNotification();

// 使用範例
notify.success('成功', '操作完成');
notify.error('錯誤', '操作失敗');
notify.warning('警告', '請注意');
notify.info('資訊', '提示訊息');
```

### 📈 Hook 使用最佳實踐

1. **依賴陣列管理**：正確設置 `useEffect` 的依賴陣列，避免無限循環
2. **狀態更新優化**：使用函數式更新避免閉包問題
3. **清理副作用**：在 `useEffect` 中返回清理函數
4. **自定義 Hook**：將複雜邏輯抽取為可重用的自定義 Hook
5. **錯誤處理**：在異步操作中妥善處理錯誤狀態

### 🎯 Hook 應用場景總結

| Hook | 主要用途 | 使用檔案 |
|------|----------|----------|
| `useState` | 本地狀態管理 | 所有頁面組件 |
| `useEffect` | 副作用處理、API 呼叫 | 所有頁面組件 |
| `useSelector` | Redux 狀態選取 | App.js, CartPage.js |
| `useDispatch` | Redux action 發送 | ProductsPage.js, HomePage.js, CartPage.js |
| `useNavigate` | 程式化路由導航 | App.js, HomePage.js, CartPage.js |
| `useContext` | Context 狀態存取 | Notification.js |
| `Form.useForm` | 表單狀態管理 | UserProfilePage.js, ProductManagement.js |
| `theme.useToken` | 主題 token 存取 | App.js |
| `useNotification` | 自定義通知系統 | 所有需要通知的組件 |

## 📁 專案結構

```
FinalProj/
├── backend/                 # 後端程式碼
│   ├── app/
│   │   ├── Controllers/     # 控制器
│   │   └── Models/         # 資料模型
│   │   
│   ├── public/             # 公開檔案
│   │   └── uploads/        # 上傳檔案
│   │   
│   ├── routes/             # 路由設定
│   └── sql/               # 資料庫結構
├── front/                  # 前端程式碼
│   ├── public/            # 靜態檔案
│   └── src/
│       ├── assets/        # 資源檔案
│       ├── components/    # React 組件
│       ├── pages/         # 頁面組件
│       ├── store/         # Redux 狀態管理
│       └── styles/        # 樣式檔案
└── README.md              # 專案說明文件
```

## 🔧 開發指令

```bash
# 前端開發
cd front
npm start          # 啟動開發伺服器
npm run build      # 建置生產版本
npm test           # 執行測試

# 程式碼品質檢查
npm run lint       # ESLint 檢查
```

## 🐛 常見問題

### Q: 前端無法連接後端 API
A: 請確認：
1. XAMPP 的 Apache 服務已啟動
2. 後端 API 路徑正確：`http://localhost/FinalProj/backend/public/index.php`
3. 檢查 `front/src/config.js` 中的 API 基礎路徑設定

### Q: 資料庫連接失敗
A: 請確認：
1. MySQL 服務已啟動
2. 資料庫名稱為 `petdeptstore`
3. 資料庫結構已正確匯入

### Q: 圖片無法顯示
A: 請確認：
1. 圖片檔案存在於 `backend/public/uploads/products/` 目錄
2. Apache 伺服器有讀取權限
3. 圖片路徑設定正確

## 📝 更新日誌

### v1.0.0 (2025-01-05)
- ✨ 完成基本電商功能
- ✨ 實作購物車系統
- ✨ 新增訂單管理功能
- ✨ 完成商品管理後台
- 🐛 修正所有 ESLint 警告
- 📦 新增 dayjs 依賴套件

## 👥 開發團隊

- **前端開發**：React + Redux + Ant Design
- **後端開發**：PHP + MySQL
- **UI/UX 設計**：響應式設計 + 使用者體驗優化

更完整的後端與前端實作細節請參考 [backendInfo.md](backendInfo.md) 與 [frontInfo.md](frontInfo.md)。

## 📄 授權條款

本專案僅供學習和展示用途。

---

如有任何問題或建議，歡迎聯繫開發團隊。 