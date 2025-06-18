<?php
namespace Controllers;
use Vendor\DB;
use Vendor\Controller;
use Models\Product as ProductModel;

class Product extends Controller
{
    private $pm; 
    
    public function __construct() {
        $this->pm = new ProductModel();
    }
    
    public function getProducts(){
        if (isset($_POST['pid'])) {
            $pid = $_POST['pid'];
            return $this->pm->getProduct($pid);
        } else {
            return $this->pm->getProducts(); 
        }
    }

    public function getProduct(){
        return $this->getProducts();
    }

    public function getAllProducts(){
        return $this->pm->getAllProducts();
    }
    
    public function newProduct(){
        // 必要參數檢查
        if (!isset($_POST['p_name']) || empty($_POST['p_name'])) {
            return array('status' => 400, 'message' => '產品名稱為必填欄位');
        }
        
        if (!isset($_POST['price']) || empty($_POST['price'])) {
            return array('status' => 400, 'message' => '產品價格為必填欄位');
        }
        
        if (!isset($_POST['stock'])) {
            return array('status' => 400, 'message' => '庫存數量為必填欄位');
        }
        
        if (!isset($_POST['category']) || empty($_POST['category'])) {
            return array('status' => 400, 'message' => '商品類別為必填欄位');
        }

        $p_name = $_POST['p_name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];
        $category = $_POST['category'];
        $p_status = isset($_POST['p_status']) ? $_POST['p_status'] : 'active';

        // 處理圖片上傳
        $imageUrl = $this->handleImageUpload();
        if ($imageUrl === false) {
            return array('status' => 400, 'message' => '圖片上傳失敗');
        }

        return $this->createNewProduct($p_name, $price, $stock, $category, $imageUrl, $p_status);
    }
    
    // 建立新產品業務邏輯
    private function createNewProduct($p_name, $price, $stock, $category, $imageUrl, $p_status) {
        // 參數驗證
        $validation = $this->validateProductData($p_name, $price, $stock);
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查產品名稱是否已存在
        $nameExists = $this->pm->checkProductNameExists($p_name);
        if ($nameExists['status'] !== 200) {
            return array('status' => 500, 'message' => '資料庫查詢錯誤');
        }
        
        if ($nameExists['result'][0]['count'] > 0) {
            return array('status' => 409, 'message' => "產品名稱「" . $p_name . "」已經存在");
        }
        
        // 插入新產品
        return $this->pm->insertProduct($p_name, $price, $stock, $category, $imageUrl, $p_status);
    }
    
    // 產品資料驗證
    private function validateProductData($p_name, $price, $stock) {
        if(empty($p_name)) {
            return array('status' => 400, 'message' => "產品名稱不可為空");
        }
        
        if(!is_numeric($price) || $price <= 0) {
            return array('status' => 400, 'message' => "產品價格必須大於零");
        }
        
        if(!is_numeric($stock) || $stock < 0) {
            return array('status' => 400, 'message' => "庫存數量不可為負數");
        }
        
        return true;
    }
    
    // 圖片上傳處理
    private function handleImageUpload() {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return null; // 沒有上傳圖片或上傳失敗，返回 null
        }
        
        $uploadDir = __DIR__ . '/../../public/uploads/products/';
        
        // 檢查上傳目錄是否存在，不存在則創建
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                return false; // 無法創建目錄
            }
        }
        
        $fileName = uniqid() . '-' . basename($_FILES['image']['name']);
        $uploadFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            return 'uploads/products/' . $fileName;
        }
        
        return false; // 上傳失敗
    }
    
    public function removeProduct(){
        if (!isset($_POST['pid']) || empty($_POST['pid'])) {
            return array('status' => 400, 'message' => '產品ID為必填欄位');
        }
        
        $pid = $_POST['pid'];
        return $this->deleteProduct($pid);
    }
    
    // 刪除產品業務邏輯
    private function deleteProduct($pid) {
        // 檢查商品是否存在
        $productExists = $this->pm->checkProductExists($pid);
        if ($productExists['status'] !== 200) {
            return array('status' => 500, 'message' => '資料庫查詢錯誤');
        }
        
        if ($productExists['result'][0]['count'] === 0) {
            return array('status' => 404, 'message' => '商品不存在');
        }
        
        // 檢查商品是否被訂單引用
        $inOrders = $this->pm->checkProductInOrders($pid);
        if ($inOrders['status'] !== 200) {
            return array('status' => 500, 'message' => '資料庫查詢錯誤');
        }
        
        if ($inOrders['result'][0]['count'] > 0) {
            return array('status' => 409, 'message' => '無法刪除商品，該商品已被訂單引用');
        }
        
        // 檢查商品是否在購物車中被引用
        $inCart = $this->pm->checkProductInCart($pid);
        if ($inCart['status'] !== 200) {
            return array('status' => 500, 'message' => '資料庫查詢錯誤');
        }
        
        if ($inCart['result'][0]['count'] > 0) {
            return array('status' => 409, 'message' => '無法刪除商品，該商品已被購物車引用');
        }
        
        // 執行刪除
        return $this->pm->deleteProduct($pid);
    }
    
    public function updateProduct(){
        // 必要參數檢查
        if (!isset($_POST['pid']) || empty($_POST['pid'])) {
            return array('status' => 400, 'message' => '產品ID為必填欄位');
        }
        
        if (!isset($_POST['p_name']) || empty($_POST['p_name'])) {
            return array('status' => 400, 'message' => '產品名稱為必填欄位');
        }
        
        if (!isset($_POST['price']) || empty($_POST['price'])) {
            return array('status' => 400, 'message' => '產品價格為必填欄位');
        }
        
        if (!isset($_POST['stock'])) {
            return array('status' => 400, 'message' => '庫存數量為必填欄位');
        }
        
        if (!isset($_POST['category']) || empty($_POST['category'])) {
            return array('status' => 400, 'message' => '商品類別為必填欄位');
        }

        $pid = $_POST['pid'];
        $p_name = $_POST['p_name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];
        $category = $_POST['category'];
        $p_status = isset($_POST['p_status']) ? $_POST['p_status'] : 'active';

        // 處理圖片上傳
        $imageUrl = $this->handleImageUpload();
        if ($imageUrl === false) {
            return array('status' => 400, 'message' => '圖片上傳失敗');
        }

        return $this->updateProductInfo($pid, $p_name, $price, $stock, $category, $imageUrl, $p_status);
    }
    
    // 更新產品業務邏輯
    private function updateProductInfo($pid, $p_name, $price, $stock, $category, $imageUrl, $p_status) {
        // 參數驗證
        $validation = $this->validateProductData($p_name, $price, $stock);
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查產品名稱是否已存在且不是當前產品
        $nameExists = $this->pm->checkProductNameExistsExcludingCurrent($p_name, $pid);
        if ($nameExists['status'] !== 200) {
            return array('status' => 500, 'message' => '資料庫查詢錯誤');
        }
        
        if ($nameExists['result'][0]['count'] > 0) {
            return array('status' => 409, 'message' => "產品名稱「" . $p_name . "」已經存在");
        }
        
        // 根據是否有新的 imageUrl 來決定更新方式
        if ($imageUrl !== null) {
            return $this->pm->updateProductWithImage($pid, $p_name, $price, $stock, $category, $imageUrl, $p_status);
        } else {
            return $this->pm->updateProductWithoutImage($pid, $p_name, $price, $stock, $category, $p_status);
        }
    }
}
?>