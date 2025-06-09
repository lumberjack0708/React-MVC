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
        $cost = $_POST['cost'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        // 直接回傳模型的結果，不處理錯誤
        return $this->pm->newProduct($p_name, $cost, $price, $stock);
    }
    
    public function removeProduct(){
        $pid = $_POST['pid'];
        return $this->pm->removeProduct($pid);
    }
    
    public function updateProduct(){
        $pid = $_POST['pid'];
        $p_name = $_POST['p_name'];
        $cost = $_POST['cost'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        // 直接回傳模型的結果，不處理錯誤
        return $this->pm->updateProduct($pid, $p_name, $cost, $price, $stock);
    }
}
?>