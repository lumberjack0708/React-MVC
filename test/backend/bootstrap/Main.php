<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Middlewares\AuthMiddleware;
use Vendor\DB;
use Vendor\Router;
class Main{
    static function run(){
        $conf =  parse_ini_file(__DIR__ . '/../vendor/.env');
        DB::$dbHost = $conf['dbHost'];
        DB::$dbName = $conf['dbName'];
        DB::$dbUser = $conf['dbUser'];
        DB::$dbPassword = $conf['dbPassword'];

        if(isset($_GET['action']))
            $action = $_GET['action'];
        else
            $action = "no_action";

        // 檢查帳密(以後說明)
        // 判斷權限(以後說明)
        // 檢查token是否有效
        $response = $responseToken = AuthMiddleware::checkToken();
        if($responseToken['status'] == 200){
            // 如果token有效，則執行路由，並將token放入$response
            if($action != "no_action") { 
                $router = new Router();
                require_once __DIR__ . "/../routes/web.php";
                $response = $router->run($action);
            }
            $response['token'] = $responseToken['token'];
        }
        else {
            // 如果token無效，看看是否有其它action需要執行，例如：doLogin，如執行登入
            switch($action){
                case 'doLogin':
                    $response = AuthMiddleware::doLogin();
                    break;
                default:
                    break;
            }  
        }
        echo json_encode($response);
    }
}
?>