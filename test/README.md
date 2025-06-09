# MVC Project

要複製的話應該是可以在右上角【code】複製結尾為`.git`的連結並到`htdocs`底下執行
```bash!
$ git clone https://github.com/SchoolProjectSet/MvcPractice.git
```
這樣隱藏目錄`.git`也會一起被帶到下載目錄裡面，以後就可以一直用`git pull`來更新你的本地repo，不用每次都Download Zip(因為之後這專案可能會越寫越大)

## 環境設置
v5.2.0的版本開始有用環境變數，下載完之後在`backend`或`vendor`資料夾底下找到`.env.example`檔案，並建立一個`.env`檔案將對應的資料庫資訊做輸入就可以讓系統正常運作了

>[!Warning]
>如果這一步沒有確實執行的話點擊任何button都會出現「undefined」。

>[!Warning]
>下載完之後要注意`axios.min.js`與`qs.min.js`的路徑問題

## Composer 安裝與設定

### 1. 安裝 Composer
1. 前往 [Composer 官方網站](https://getcomposer.org/download/) 下載並安裝 Composer
2. 對於 Windows 用戶，建議下載 Composer-Setup.exe 安裝檔
3. 安裝完成後，開啟命令提示字元或 PowerShell，輸入 `composer -V` 確認安裝成功

### 2. 設定 composer.json
1. 在 `backend` 目錄下建立 `composer.json` 檔案，內容如下：
```json
{
    "autoload": {
        "psr-4": {
           "Controllers\\": "app/Controllers/",
            "Models\\": "app/Models/",
            "Vendor\\": "vendor/"
        }
    }
}
```

### 3. 產生 autoload 檔案
1. 在命令提示字元或 PowerShell 中，切換到 `backend` 目錄
```bash
cd backend
```
2. 執行以下命令產生自動載入檔案
```bash
composer dump-autoload
```

### 4. 安裝 JWT 套件
1. 在 `backend` 目錄下執行以下命令安裝 firebase/php-jwt 套件
```bash
composer require firebase/php-jwt
```
2. 此命令會自動產生 `composer.lock` 檔案並更新 `vendor` 目錄

### 5. 確認安裝
1. 安裝完成後，`backend` 目錄下應該會有以下檔案和目錄：
   - `composer.json`：套件設定檔
   - `composer.lock`：套件版本鎖定檔
   - `vendor/`：套件依賴目錄及自動載入檔案

(聽懂舉手)