<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Vendor\DB;
use Vendor\Router;
use Middlewares\AuthMiddleware;

class Main{
    static function run(){
        $action = "no_action";
        if(isset($_GET['action']))
            $action = $_GET['action'];
        else
            $action = "no_action";

        $conf =  parse_ini_file(__DIR__ . '/../vendor/.env');
        DB::$dbHost = $conf['dbHost'];
        DB::$dbName = $conf['dbName'];
        DB::$dbUser = $conf['dbUser'];
        DB::$dbPassword = $conf['dbPassword'];

        

        //檢查帳密、token是否有效
        $response = $responseToken = AuthMiddleware::checkToken();
        if($responseToken['status'] == 200){
            // 如果token有效，則執行路由，並將token放入$response
            if($action != "no_action") { 
                $router = new Router();
                require_once __DIR__ . "/../routes/web.php";
                $response = $router->run($action);
            }
            $response['token'] = $responseToken['token'];
        }else{  
            // 如果token無效，看看是否有其它action需要執行，例如：doLogin，如執行登入
            switch($action){
                case 'doLogin':
                    // 執行登入，action為doLogin
                    $response = AuthMiddleware::doLogin();
                    break;
                default:
                    break;
            }  
        }

        //判斷權限(以後說明)

        echo json_encode($response);
    }
}
?>