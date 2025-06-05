# 靜態圖片使用說明

## 圖片結構

本專案使用以下結構來管理靜態圖片資源：

```
src/
└── assets/
    └── images/
        ├── food/          # 存放食品類別圖片
        │   ├── cat-food.jpg
        │   └── dog-bone-clean.jpg
        ├── toy/           # 存放玩具類別圖片
        │   └── cat-tunnel.jpg
        ├── accessories/   # 存放配件類別圖片
        │   ├── pet-water-dispenser.jpg
        │   ├── pet-feeder.jpg
        │   └── cat-litter-box.jpg
        └── index.js       # 圖片導出和映射文件
```

## 使用方式

### 1. 添加新圖片

1. 在適當的類別資料夾中添加圖片檔案，例如：`src/assets/images/food/new-food.jpg`
2. 在 `src/assets/images/index.js` 中導入並導出新圖片：

```javascript
// 導入新圖片
import newFood from './food/new-food.jpg';

// 在 images 物件中添加新圖片
export const images = {
  food: {
    // ...其他食品圖片
    newFood
  },
  // ...其他類別
};

// 在映射中添加產品名稱與圖片的對應關係
const imageMapping = {
  food: {
    // ...其他食品映射
    '新食品名稱': 'newFood'
  },
  // ...其他類別映射
};
```

### 2. 使用圖片

在任何組件中，您可以使用以下方式顯示產品圖片：

```javascript
// 導入函數
import { getProductImage } from '../assets/images/index';

// 在JSX中使用
<img 
  src={getProductImage(product.category, product.name) || '/placeholder.png'} 
  alt={product.name} 
/>
```

### 3. 直接使用特定圖片

如果您需要直接使用特定圖片，可以這樣做：

```javascript
// 導入特定圖片
import { images } from '../assets/images/index';

// 在JSX中使用
<img 
  src={images.food.catFood} 
  alt="高級貓糧" 
/>
```

## 注意事項

1. 確保圖片名稱不含空格和特殊字元，使用連字符 `-` 或駝峰命名法來命名文件
2. 建議使用 `.jpg` 或 `.png` 格式的圖片，並進行適當的壓縮以減少載入時間
3. 如果找不到對應的圖片，系統會顯示預設的占位圖片 (`/placeholder.png`)
4. 若要提高載入效能，建議將圖片大小控制在 100KB 以下
