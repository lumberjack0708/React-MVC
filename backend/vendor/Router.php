<?php
    namespace Vendor;
    class Router{
        private $routeTable;
        public function __construct(){
            $this->routeTable = array();
            
        }
        public function register($action, $class, $method){
            // 創建一個包含類別和方法的關聯陣列
            $arr['class'] = $class;
            $arr['method'] = $method;
            // 在路由表中註冊對應的操作、類別和方法
            $this->routeTable[$action] = $arr;
        }
        public function run($action){
            // 檢查路由是否存在
            if (!isset($this->routeTable[$action])) {
                return ['status' => 404, 'message' => "找不到對應的操作：$action"];
            }
            
            $class = $this->routeTable[$action]['class'];
            $method = $this->routeTable[$action]['method'];
            $class = "Controllers\\" . $class;
            $controller = new $class();
            $response = $controller->$method();
            return $response;
        }
    }
?>