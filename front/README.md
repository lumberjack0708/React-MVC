# React 寵物百貨網站專案報告

## 專案簡介與動機

在當今數位化時代，電子商務已成為商業的重要趨勢。本專案以寵物百貨為主題，結合了 React 前端框架的強大功能，打造一個現代化、互動性強的線上購物平台。選擇寵物相關產品作為主題，是因為寵物市場持續成長，且消費者對於寵物用品的需求多樣化，非常適合實踐各種前端技術。

本專案的主要目標是實踐 React 生態系統中的最佳實踐，包括函數式組件、Hooks API、狀態管理、路由系統等，同時提供優質的使用者體驗。專案遵循「React 專案開發總規格」的規範進行開發，確保代碼質量和可維護性。

## 專案特色與功能亮點

本寵物百貨網站具有以下特色和功能：

### 1. 精心設計的用戶界面
- **響應式佈局**：無論用戶使用桌面電腦、平板還是手機，都能獲得最佳瀏覽體驗
- **直觀的導航系統**：清晰的導航結構，用戶可以輕鬆找到所需的產品和功能
- **品牌一致性**：統一的設計語言，包括顏色、字體和組件樣式，給用戶帶來專業的視覺體驗
- **動態交互效果**：各種過渡動畫和交互效果增強用戶體驗

### 2. 完整的購物體驗流程
- **多樣化產品展示**：首頁展示推薦產品，產品頁面支持分類查看
- **產品分類與篩選**：用戶可以按類別（食品、玩具、配件）篩選產品
- **詳細的產品信息**：包含產品圖片、價格、規格和詳細描述
- **優化的購物車系統**：方便的加入、修改、刪除購物車內商品功能

### 3. 先進的通知系統
- **即時反饋**：用戶操作後獲得即時反饋，如添加購物車成功提示
- **多樣化通知類型**：支持成功、信息、警告和錯誤四種通知類型
- **自動消失功能**：通知會在一定時間後自動消失，避免干擾
- **可手動關閉**：用戶可以主動關閉不需要的通知

### 4. 模態框產品詳情
- **優雅的彈出式窗口**：查看產品詳情時不必跳轉頁面
- **豐富的產品信息**：在模態窗口中展示完整的產品信息
- **直接購買功能**：可以直接從詳情頁面加入購物車
- **平滑過渡動畫**：增加模態框開關的視覺流暢度

## 技術選型與架構設計

### 核心技術棧

#### React 生態系統
- **React 18**：採用最新版本的 React 框架，使用函數式組件和 Hooks 編寫全部代碼
- **React Router v6**：使用最新的 React Router 實現頁面路由，支持嵌套路由和動態路由
- **Redux Toolkit**：使用官方推薦的狀態管理方案，簡化 Redux 的使用複雜度
- **React Context API**：用於全局主題管理和通知系統

#### 樣式解決方案
- **Emotion**：採用 CSS-in-JS 的現代解決方案，實現組件樣式隔離和動態樣式變化
- **Normalize.css**：統一不同瀏覽器的基礎樣式，保證一致的顯示效果
- **Responsive Design**：實現全面的響應式設計，適配不同屏幕尺寸

#### 開發工具與工作流
- **Create React App**：使用官方脚手架快速搭建開發環境
- **ESLint**：代碼質量檢查工具，確保代碼風格一致性
- **NPM**：依賴管理和腳本運行
- **Git**：版本控制系統

### 架構設計原則

#### 1. 組件劃分與責任分離
本專案嚴格遵循單一職責原則，將每個組件設計為只負責一項具體功能：
- **展示型組件（Presentational Components）**：負責 UI 的渲染，如 Button、Card 等
- **容器型組件（Container Components）**：負責數據處理和業務邏輯，如 ProductsPage、CartPage 等
- **佈局組件（Layout Components）**：負責整體佈局，如 Header、Footer 等

#### 2. 狀態管理策略
根據狀態的作用範圍，採用不同的管理方式：
- **全局狀態**：使用 Redux Toolkit 管理購物車數據和計數器狀態
- **主題狀態**：使用 Context API 實現全站主題共享
- **通知系統**：使用自定義 Hook 和 Context 實現全局通知管理
- **局部狀態**：使用 useState Hook 管理組件內部狀態

#### 3. 數據流設計
遵循 Flux 單向數據流思想：
- 數據從上往下通過 props 傳遞
- 狀態變更通過派發 action 到 reducer 處理
- 組件訂閱 store 的變化並重新渲染

## React Hooks 的深度應用

本專案充分利用 React Hooks 的強大功能，每個 Hook 都有其特定的應用場景：

### useState
在多個組件中使用 useState 管理本地狀態，例如：
- 產品列表頁面的類別篩選狀態
- 表單的輸入字段值
- 模態框的顯示狀態

**實例代碼**:
```jsx
// 產品類別篩選狀態
const [categoryFilter, setCategoryFilter] = useState('all');

// 根據篩選狀態獲取產品
const filteredProducts = categoryFilter === 'all' 
  ? products 
  : products.filter(product => product.category === categoryFilter);
```

### useEffect
使用 useEffect 處理多種副作用，如：
- 模擬 API 請求加載產品數據
- 模態框打開時禁用背景滾動
- 通知系統的自動消失計時器

**實例代碼**:
```jsx
// 模擬 API 請求加載推薦產品
useEffect(() => {
  setLoading(true);
  fetchFeaturedProducts()
    .then(data => {
      setFeaturedProducts(data);
      setLoading(false);
    });
}, []);

// 模態框打開時禁用背景滾動
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'auto';
  };
}, []);
```

### useContext
使用 useContext 實現跨組件數據共享：
- 主題數據全局共享
- 通知系統的上下文提供

**實例代碼**:
```jsx
// 創建主題上下文
const ThemeContext = createContext();

// 在組件中使用主題
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### useMemo
使用 useMemo 優化計算性能：
- 計算 Counter 組件中的平方值
- 優化產品篩選邏輯

**實例代碼**:
```jsx
// 使用 useMemo 計算 count 的平方值
const squaredValue = useMemo(() => {
  console.log('計算 count 的平方');
  return count * count;
}, [count]);
```

### useRef
使用 useRef 實現非受控表單和 DOM 操作：
- 實現非受控表單元素的值獲取
- 保存引用不觸發渲染

**實例代碼**:
```jsx
// 非受控表單實現
const uncontrolledNameRef = useRef();
const uncontrolledEmailRef = useRef();

// 處理表單提交
const handleUncontrolledSubmit = (e) => {
  e.preventDefault();
  const formData = {
    name: uncontrolledNameRef.current.value,
    email: uncontrolledEmailRef.current.value,
  };
  console.log('非受控表單數據:', formData);
};
```

## Redux Toolkit 狀態管理

本專案使用 Redux Toolkit 管理全局狀態，相比傳統 Redux，它大大簡化了配置和使用流程。

### cartSlice 實現

購物車 slice 處理商品的添加、數量修改和刪除：

```jsx
export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});
```

### counterSlice 實現

計數器 slice 實現了計數的基本功能和自定義增加值：

```jsx
export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    }
  },
});
```

### Redux Store 配置

將各個 slice 組合成統一的 store：

```jsx
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import counterReducer from './counterSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
    counter: counterReducer,
  },
});
```

## Emotion CSS-in-JS 樣式系統

使用 Emotion 的 CSS-in-JS 實現了強大且靈活的樣式系統：

### 動態主題樣式

根據主題動態變化元素樣式：

```jsx
// 定義顏色主題
const colors = {
  light: {
    background: '#f7f7f7',
    text: '#333333',
    primary: '#2B2118',
    secondary: '#A24C00',
  },
  dark: {
    background: '#222222',
    text: '#f7f7f7',
    primary: '#7b8cff',
    secondary: '#ff7b97',
  }
};

// 按鈕樣式
export const Button = styled.button`
  background-color: ${props => props.primary ? colors[props.theme].primary : colors[props.theme].secondary};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;
```

### 樣式組件封裝

將常用 UI 元素封裝為樣式組件：

```jsx
// 卡片樣式
export const Card = styled.div`
  background-color: ${props => colors[props.theme].background === '#f7f7f7' ? 'white' : '#333'};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

// 標題樣式
export const Heading = styled.h1`
  color: ${props => colors[props.theme].primary};
  margin-bottom: 16px;
`;
```

## 靜態資源管理系統

本專案實現了一個完整的靜態資源管理系統，特別是產品圖片的管理：

### 目錄結構設計

圖片資源按產品類別組織：

```
src/
  └── assets/
      └── images/
          ├── food/       # 食品類圖片
          ├── toy/        # 玩具類圖片
          └── accessories/ # 配件類圖片
```

### 圖片索引與映射

創建統一的圖片索引文件，便於引用：

```jsx
// 食品類圖片
import catFood from './food/cat-food.jpg';
import dogBoneClean from './food/dog-bone-clean.jpg';

// 玩具類圖片
import catTunnel from './toy/cat-tunnel.jpg';

// 配件類圖片
import petWaterDispenser from './accessories/pet-water-dispenser.jpg';
import petFeeder from './accessories/pet-feeder.jpg';
import catLitterBox from './accessories/cat-litter-box.jpg';

// 導出所有圖片對象
export const images = {
  food: {
    catFood,
    dogBoneClean
  },
  toy: {
    catTunnel
  },
  accessories: {
    petWaterDispenser,
    petFeeder,
    catLitterBox
  }
};

// 取得產品圖片的輔助函數
export const getProductImage = (category, name) => {
  // 圖片名稱與產品的對應表
  const imageMapping = {
    food: {
      '高級貓糧': 'catFood',
      '狗狗潔牙骨': 'dogBoneClean'
    },
    toy: {
      '貓咪隧道玩具': 'catTunnel'
    },
    accessories: {
      '寵物自動飲水機': 'petWaterDispenser',
      '寵物自動喂食器': 'petFeeder',
      '貓砂盆': 'catLitterBox'
    }
  };
  
  // 檢查映射是否存在
  if (imageMapping[category] && imageMapping[category][name]) {
    const imageName = imageMapping[category][name];
    return images[category][imageName];
  }
  
  // 返回預設圖片或 null
  return null;
};
```

## 通知系統實現

本專案實現了一個功能完善的通知系統，取代了傳統的 alert 提示：

### 通知組件設計

精心設計的通知組件樣式：

```jsx
// 通知容器樣式
const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 350px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 通知樣式
const NotificationItem = styled.div`
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease-out forwards;
  background-color: ${props => props.type === 'success' ? '#ebf9eb' : 
    props.type === 'info' ? '#e8f4fd' : 
    props.type === 'warning' ? '#fff8e6' : '#fde8e8'};
  border-left: 4px solid ${props => props.type === 'success' ? '#52c41a' : 
    props.type === 'info' ? '#1890ff' : 
    props.type === 'warning' ? '#faad14' : '#f5222d'};
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
```

### Context API 集成

使用 Context API 實現全局通知狀態管理：

```jsx
// 全局通知上下文
export const NotificationContext = React.createContext();

// 通知提供者組件
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // 新增通知
  const addNotification = (notification) => {
    const id = `notification-${Date.now()}`;
    setNotifications(prev => [...prev, { id, ...notification }]);
    return id;
  };
  
  // 移除通知
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // 提供便捷方法
  const notify = {
    success: (title, description) => addNotification({ title, description, type: 'success' }),
    info: (title, description) => addNotification({ title, description, type: 'info' }),
    warning: (title, description) => addNotification({ title, description, type: 'warning' }),
    error: (title, description) => addNotification({ title, description, type: 'error' })
  };
  
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};
```

### 自定義 Hook

提供自定義 Hook 簡化通知使用：

```jsx
// 自定義 Hook，用於在其他組件中使用通知系統
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
```

## 產品詳情模態框

本專案實現了一個功能豐富的產品詳情模態框，提升了用戶體驗：

### 模態框設計

優雅的模態框設計與動畫效果：

```jsx
// 模態對話框背景
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// 模態對話框容器
const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
  animation: scaleIn 0.2s ease-out;
  
  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
```

### 結構化產品信息

結構化展示產品詳細信息：

```jsx
<ModalContent>
  <ProductImageContainer>
    <ProductImage 
      src={product.imageSource} 
      alt={product.name} 
    />
  </ProductImageContainer>
  
  <ProductInfoList>
    <ProductInfoItem>
      <ProductInfoLabel>價格</ProductInfoLabel>
      <ProductInfoValue style={{ color: '#660000', fontWeight: 'bold' }}>
        ${product.price}
      </ProductInfoValue>
    </ProductInfoItem>
    
    <ProductInfoItem>
      <ProductInfoLabel>類別</ProductInfoLabel>
      <ProductInfoValue>
        {categoryNames[product.category] || product.category}
      </ProductInfoValue>
    </ProductInfoItem>
    
    <ProductInfoItem>
      <ProductInfoLabel>規格</ProductInfoLabel>
      <ProductInfoValue>
        {productSpecs[product.name] || '標準規格'}
      </ProductInfoValue>
    </ProductInfoItem>
  </ProductInfoList>
  
  <DescriptionSection>
    <h3>產品介紹</h3>
    <ProductDescription>
      {productDescriptions[product.name] || 
        '這是一個優質的寵物產品，專為您的毛小孩設計，保證品質與安全性。'}
    </ProductDescription>
  </DescriptionSection>
</ModalContent>
```

## 專案總結與反思

### 技術選型的合理性

本專案在技術選型上充分考慮了以下因素：

1. **React 生態系統的成熟度**：React 作為一個成熟的前端框架，有豐富的生態系統和社區支持，使用 React 及其相關技術可以快速構建穩定的應用。

2. **函數式編程范式的優勢**：採用 Function Component + React Hooks 的開發方式，代碼更簡潔，邏輯更清晰，可複用性更高。

3. **Redux Toolkit 的簡化性**：相比傳統 Redux，Redux Toolkit 簡化了配置和使用流程，減少了樣板代碼，提高了開發效率。

4. **Emotion 的靈活性**：CSS-in-JS 方案使樣式與組件緊密結合，支持動態樣式，避免了全局樣式污染。

### 開發過程中的挑戰與解決方案

在開發過程中遇到了以下挑戰及其解決方案：

1. **狀態管理的合理劃分**：
   - **挑戰**：如何在本地狀態和全局狀態之間做出合理選擇
   - **解決方案**：根據狀態的作用範圍，將購物車數據等全局狀態放入 Redux，將表單數據等本地狀態使用 useState 管理

2. **靜態資源的組織**：
   - **挑戰**：如何有效管理和引用產品圖片
   - **解決方案**：建立結構化的圖片目錄，實現圖片映射助手函數，統一管理圖片資源

3. **用戶體驗的優化**：
   - **挑戰**：提供直觀、流暢的用戶體驗
   - **解決方案**：實現產品詳情模態框、通知系統，優化按鈕布局和交互效果

### 未來優化方向

本專案仍有以下優化空間：

1. **性能優化**：
   - 實現代碼分割，使用 React.lazy 和 Suspense 懶加載組件
   - 使用 useMemo 和 useCallback 優化更多計算密集型操作

2. **功能擴展**：
   - 實現用戶認證系統，支持登錄、註冊、個人中心等功能
   - 添加產品搜索功能，使用戶更容易找到所需產品
   - 實現訂單系統，包括結算、支付流程等

3. **測試覆蓋**：
   - 使用 Jest 和 React Testing Library 編寫單元測試和集成測試
   - 實現持續集成/持續部署(CI/CD)流程

4. **後端集成**：
   - 連接實際的後端 API，實現真實數據交互
   - 實現數據緩存機制，優化加載性能

### 學習收穫與成長

通過本專案的開發，我獲得了以下收穫：

1. **深入理解 React 最佳實踐**：
   - 掌握了 Function Component 和 Hooks 的使用模式和技巧
   - 理解了單向數據流和組件通信的最佳實踐

2. **狀態管理能力的提升**：
   - 熟練運用 Redux Toolkit 進行全局狀態管理
   - 掌握了不同情境下狀態管理的策略選擇

3. **前端架構設計能力**：
   - 學會了如何設計可維護、可擴展的前端應用架構
   - 理解了組件拆分和責任分離的原則

4. **CSS-in-JS 實踐經驗**：
   - 掌握了 Emotion 框架的使用方法
   - 理解了樣式組件化的優勢和最佳實踐

5. **用戶體驗設計思維**：
   - 培養了以用戶為中心的設計思維
   - 學會了如何優化交互細節提升用戶體驗

## 開發與執行指南

### 環境要求

- Node.js v14.0.0 或更高版本
- npm v6.0.0 或更高版本

### 安裝步驟

1. 克隆專案到本地：
   ```bash
   git clone <repository-url>
   cd React-FinalProj
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 啟動開發服務器：
   ```bash
   npm start
   ```

4. 瀏覽器訪問：
   ```
   http://localhost:3000
   ```

### 專案目錄結構

完整的專案結構如下：

```
src/
  ├─ assets/            # 靜態資源
  │   └─ images/        # 產品圖片
  │       ├─ food/      # 食品類圖片
  │       ├─ toy/       # 玩具類圖片
  │       └─ accessories/ # 配件類圖片
  ├─ components/        # 共用組件
  │   ├─ Footer.js      # 頁尾組件
  │   ├─ Notification.js # 通知系統
  │   └─ ProductDetailModal.js # 產品詳情模態框
  ├─ hooks/             # 自定義 Hooks
  │   └─ useTheme.js    # 主題 Hook
  ├─ pages/             # 頁面組件
  │   ├─ HomePage.js    # 首頁
  │   ├─ ProductsPage.js # 產品頁
  │   ├─ CartPage.js    # 購物車頁
  │   └─ NotFoundPage.js # 404頁面
  ├─ redux/             # Redux 相關
  │   ├─ cartSlice.js   # 購物車 Slice
  │   ├─ counterSlice.js # 計數器 Slice
  │   └─ store.js       # Redux Store
  ├─ styles/            # 樣式文件
  │   └─ styles.js      # Emotion 樣式
  ├─ App.css            # 應用樣式
  ├─ App.js             # 主應用
  └─ index.js           # 入口文件
```

## 參考資料

- [React 官方文檔](https://reactjs.org/docs/getting-started.html)
- [Redux Toolkit 文檔](https://redux-toolkit.js.org/)
- [React Router 文檔](https://reactrouter.com/)
- [Emotion 文檔](https://emotion.sh/docs/introduction)
- [React Hooks API 參考](https://reactjs.org/docs/hooks-reference.html)

## 🔧 功能詳解

### 1. 路由系統

使用 React Router v6 實現了四個主要頁面的路由：

- **首頁** - 展示推薦產品
- **產品頁** - 展示所有產品與分類篩選
- **購物車頁** - 管理已選購商品
- **404頁面** - 處理不存在的路由

### 2. 狀態管理

使用 Redux Toolkit 進行全局狀態管理：

- **cartSlice.js** - 管理購物車狀態，實現添加、更新數量、刪除等功能
- **counterSlice.js** - 實現計數器功能，包含加減與自定增值

### 3. 樣式處理

使用 Emotion 進行樣式管理：

- **styles.js** - 定義全局樣式與組件樣式
- 動態樣式根據主題變化，實現類似深淺模式的效果

### 4. 自定義Hook

- **useTheme** - 管理應用主題狀態
- **useNotification** - 自定義通知Hook，提供彈出式通知功能

### 5. 表單處理

實現了兩種表單處理方式：

- **受控表單** - 使用 useState 管理表單狀態
- **非受控表單** - 使用 useRef 直接操作DOM

### 6. 效能優化

- 使用 **useMemo** 避免重複計算
- 產品卡片使用固定高度避免布局偏移
- 圖片使用 `object-fit: contain` 優化顯示

## ✅ 完整開發流程

### Phase 1: 環境建置

1. 使用 `create-react-app` 建立專案框架
2. 安裝必要依賴套件：
   - react-router-dom
   - @reduxjs/toolkit 和 react-redux
   - @emotion/react 和 @emotion/styled
   - normalize.css

### Phase 2: 專案結構設計

1. 依功能建立資料夾結構
2. 設計路由系統和頁面組件
3. 建立Redux狀態管理架構

### Phase 3: 功能實作

1. **主頁面開發**
   - 實作首頁推薦產品卡片
   - 使用 useEffect 模擬 API 請求載入產品

2. **產品功能實作**
   - 實作產品列表與篩選功能
   - 創建產品詳情模態框
   - 實作通知系統

3. **購物車功能實作**
   - 使用 Redux 管理購物車狀態
   - 實作購物車項目的增減與刪除

4. **靜態資源管理**
   - 建立圖片資源目錄結構
   - 實作圖片載入助手函數

### Phase 4: 優化與完善

1. 增加統一的錯誤處理
2. 優化組件渲染效能
3. 改善UI/UX細節
4. 確保響應式設計適配不同設備

## 📋 驗收項目檢查表

對照規格書中的驗收標準，本專案已實現：

- ✅ 專案可成功啟動 (`npm start`)，無 ESLint 嚴重錯誤
- ✅ 使用 React Router 建立至少三個可切換頁面，含 404 頁面
- ✅ 有至少 2 個元件使用 `useState`、1 個使用 `useEffect` 模擬 API 行為
- ✅ 建立 `useContext` 應用場景，用於主題管理
- ✅ Redux Toolkit 成功串接並實作 counter（含加減與自定加值）
- ✅ 表單頁面展示 controlled 和 uncontrolled 表單並進行驗證
- ✅ 全站採 Emotion 樣式處理，並展示動態變色例子
- ✅ 使用組件拆分和合理結構提供效能優化

## 🏃‍♂️ 如何運行

1. 安裝依賴套件：
   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npm start
   ```

3. 開啟瀏覽器訪問：
   ```
   http://localhost:3000
   ```

## 📚 專案結構說明

```
src/
  ├─ assets/            # 靜態資源
  │   └─ images/        # 產品圖片
  │       ├─ food/      # 食品類圖片
  │       ├─ toy/       # 玩具類圖片
  │       └─ accessories/ # 配件類圖片
  ├─ components/        # 共用組件
  │   ├─ Footer.js      # 頁尾組件
  │   ├─ Notification.js # 通知系統
  │   └─ ProductDetailModal.js # 產品詳情模態框
  ├─ hooks/             # 自定義 Hooks
  │   └─ useTheme.js    # 主題 Hook
  ├─ pages/             # 頁面組件
  │   ├─ HomePage.js    # 首頁
  │   ├─ ProductsPage.js # 產品頁
  │   ├─ CartPage.js    # 購物車頁
  │   └─ NotFoundPage.js # 404頁面
  ├─ redux/             # Redux 相關
  │   ├─ cartSlice.js   # 購物車 Slice
  │   ├─ counterSlice.js # 計數器 Slice
  │   └─ store.js       # Redux Store
  ├─ styles/            # 樣式文件
  │   └─ styles.js      # Emotion 樣式
  ├─ App.css            # 應用樣式
  ├─ App.js             # 主應用
  └─ index.js           # 入口文件
```

## 📝 未來優化方向

未來可以考慮增加以下功能：

1. 使用 `React.lazy()` + `Suspense` 實作頁面懶加載
2. 使用 Jest + React Testing Library 撰寫單元測試
3. 加入用戶登入/註冊系統
4. 引入實際的後端 API
5. 導入 GitHub Actions 實作 CI/CD 流程
