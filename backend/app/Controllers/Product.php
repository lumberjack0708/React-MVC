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
    
    public function newProduct(){
        $p_name = $_POST['p_name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];
        $category = $_POST['category'];
        $imageUrl = null;

        // 處理圖片上傳
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/products/';
            $fileName = uniqid() . '-' . basename($_FILES['image']['name']);
            $uploadFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                $imageUrl = 'uploads/products/' . $fileName;
            }
        }

        return $this->pm->newProduct($p_name, $price, $stock, $category, $imageUrl);
    }
    
    public function removeProduct(){
        $pid = $_POST['pid'];
        return $this->pm->removeProduct($pid);
    }
    
    public function updateProduct(){
        $pid = $_POST['pid'];
        $p_name = $_POST['p_name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];
        $category = $_POST['category'];
        $imageUrl = null;

        // 處理圖片上傳
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/products/';
            $fileName = uniqid() . '-' . basename($_FILES['image']['name']);
            $uploadFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                $imageUrl = 'uploads/products/' . $fileName;
            }
        }

        return $this->pm->updateProduct($pid, $p_name, $price, $stock, $category, $imageUrl);
    }
}
?>