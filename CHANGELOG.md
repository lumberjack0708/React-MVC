# 更新日誌

本檔案記錄了此專案所有重要的變更。

格式基於 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，
並且專案遵循語義化版本控制 ([Semantic Versioning](https://semver.org/spec/v2.0.0.html))。

## [2.0.0] - 2025-06-10
### 新增
- JWT&Token登入機制，串接前後端，並將Token時效設定為一小時
- 【購買紀錄】防呆機制，新增Token過期時的防呆機制，從根源上避免Token過期的時候會狂刷錯誤的問題
- 新增`Account.php`、`Order.php`、`Product.php`等檔案的權限控管至`Action.php`、`AuthMIddleware.php`、`main.php`
  
### Todo
- Token過期後購買紀錄沒有相對應的頁面顯示，而是不斷跳錯誤訊息，很醜!

### Fixed
- 修正前幾個版本登入之後所有頁面皆無法正常使用的問題，是因為在`backend/routes/web.php`檔案中註冊了錯誤的路由(不屬於中介層的路由)，而這些`include_once`語句會這些程式碼，進而產生錯誤
- 修改 `ProductForm.js` 將 `name` 改為 `p_name`，解決無法正常新增/刪除商品的問題
- 修正原先兩個身分都無法訪問`action=getUser`的問題，原因是因為原先的做法是透過傳入參數給`action=getUsers`來進入`getUser()`，但這樣的方法會因為一般使用者無法訪問`action=getUsers`的原因而被擋下
- 修正邏輯錯誤: 未登入的人按下【加入購物車】後會被擋下來
  1.  阻止加入購物車 
  2.  顯示警告訊息 - 使用 `notify.warning` 提示用戶需要先登入
  3.  自動彈出登入視窗呼叫`onLoginRequest()`(`Homepage.js`、`ProductsPage.js`)
- 修正產品詳情模態視窗(`ProductDetailModal.js`)的圖片顯示問題，原本的路徑現在已不存在，更新為新的`API_CONFIG`配置

### Changed
- 將原本全域可見的右上角店家管理按鈕更新為`user?.role_id === 1`才可見，並且在`App.js`的路由設定中設有一樣的邏輯閥確定只有Admin身分可以訪問
- 將`action=getProducts`改為開放權限，未登入也可以訪問
- 將`Style.js`中的`ProductImage`樣式元件移除滑鼠懸停圖片放大效果，避免懸停時會截斷商品卡陰影的情況發生


## [1.1.0] - 2025-06-07

### 新增
- 訂單管理相關路由與 CORS 設定 (5fe176b, cc63e07)
- 產品管理與圖片上傳功能 (a993c59, b2c735a)
- 顯示庫存量於商品卡片 (81c33eb)
- 訂單統計與購買紀錄頁面 (fe9d82e)
- 購物車串接 newOrder API (1b2184f)

### 修改
- 將 User 控制器與模型改為 Account 類別並調整路由 (cc63e07)
- 更新多個頁面樣式 (bc27608)
- 調整訂單詳情查詢邏輯 (0f3a91e)
- 更新 README 說明 (102f0ba)

### 已移除
- 移除不再使用的 SQL 檔案及相關註解 (5fe176b, 18bce45)
- 刪除 User 控制器與模型 (cc63e07)

### 已修正
- 修正 menu z-index 排序問題 (3f1a0dc)
- 修正新增產品圖片載入問題 (f78db3a, 39c1e32)
- 修正 HomePage 樣式匯入路徑 (a6b5ca1)
- 修正後台警告 (e195589)

## [1.0.0] - 2025-06-05

### 新增
- **後端**商品CRUD功能呼叫完善(店家身分)、檢視商品(無須登入)
- **後端**帳戶資料更改功能完善(所有已登入身分)

### todo 
- 商品購買、歷史紀錄後端
- 訂單管理後端功能實現



## [模板]

### 新增 (Added)
- (此處記錄即將發佈版本的新功能)
- 例如：使用者個人資料頁面。

### 修改 (Changed)
- (此處記錄即將發佈版本中現有功能的變更)
- 例如：更新了登入頁面的使用者介面。

### 已棄用 (Deprecated)
- (此處記錄即將發佈版本中將被移除的舊功能)

### 已移除 (Removed)
- (此處記錄即將發佈版本中已被移除的功能)

### 已修正 (Fixed)
- (此處記錄即將發佈版本中的錯誤修復)
- 例如：修正了特定情況下產品無法加入購物車的問題。

### 安全性 (Security)
- (此處記錄即將發佈版本中與安全性相關的改進