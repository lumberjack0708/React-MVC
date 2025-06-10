# Backend Implementation Details

本文件說明後端架構與實作方式，程式碼位於 `backend/` 目錄。

## Technologies

- **PHP 8+**：使用 PDO 連線 MySQL。
- **MySQL**：資料庫儲存商品與訂單資料。
- **Composer**：套件管理，主要使用 `firebase/php-jwt` 提供 JWT 功能。
- **自製 MVC 架構**：透過 `Router`、`Controller`、`Models` 實現。
- **JWT 驗證與權限控管**：`AuthMiddleware` 負責解析與驗證 token，並依權限判斷是否可執行動作。

## Project Structure

```
backend/
  ├── app/
  │   ├── Controllers/  # 各功能控制器
  │   ├── Models/       # 資料存取與商業邏輯
  │   └── Middlewares/  # 驗證與權限檢查
  ├── bootstrap/        # 程式入口
  ├── public/           # 對外公開的 index.php 與上傳資料夾
  ├── routes/           # 路由註冊
  ├── sql/              # 資料庫建置腳本
  └── vendor/           # 自訂函式與第三方套件
```

## Initialization Flow

1. `public/index.php` 允許 CORS 並載入 `bootstrap/Main.php`。
2. `Main::run()` 讀取 `.env` 取得資料庫連線資訊並初始化 `DB`。
3. 依 `action` 參數判斷是否需要經過 `AuthMiddleware` 驗證。
4. 驗證通過後由 `Router` 根據 `routes/web.php` 對應控制器及方法。
5. 控制器呼叫對應 `Model` 執行資料庫操作並回傳標準化 JSON 結果。

## Authentication

- 採用 JWT，登入成功後回傳 token，有效時間一小時。
- 之後的請求需在 HTTP Header 帶入 `Auth: <token>`。
- `AuthMiddleware::checkToken()` 解析 token 並取得帳號資訊。
- `checkPermission()` 比對角色權限 (`action_roles` 與用戶 `user_roles`) 決定是否允許執行。

## Example Routes

`routes/web.php` 透過 `$router->register()` 宣告路由。例如：

```php
$router->register(action: 'getProducts', class: 'Product', method: 'getProducts');
$router->register(action: 'newOrder', class: 'Order', method: 'newOrder');
```

以上代表當網址帶入 `?action=getProducts` 時會執行 `Controllers\Product::getProducts()`。

## Database Access

`Vendor\DB` 封裝常用的 `select`、`insert`、`update`、`delete` 方法，並以 PDO 連線：

```php
$result = DB::select('SELECT * FROM product WHERE product_id=?', [$pid]);
```

每個方法皆回傳帶有 `status`、`message`、`result` 的陣列，供前端統一處理。

