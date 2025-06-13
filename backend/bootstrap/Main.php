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

        

        // 如果是公開 API，直接執行路由（不需要 token 驗證）
        if($action == "getProducts" || $action == "newUser") {
            $router = new Router();
            require_once __DIR__ . "/../routes/web.php";
            $response = $router->run($action);
        } else {
            // 其他動作需要檢查 token
            $response = $responseToken = AuthMiddleware::checkToken();  //檢查token是否有效
            if($responseToken['status'] == 200){
                // 如果token有效，則執行路由，並將token放入$response
                if($action != "no_action") { 
                    // 判斷是否具備足夠的權限，準備執行所需的action，並將新取得的token放入$response
                    // 如果沒有，則返回403
                    $response = AuthMiddleware::checkPermission($action);
                    if($response['status'] == 200){
                        $router = new Router();
                        require_once __DIR__ . "/../routes/web.php";
                        $response = $router->run($action);
                    }else{
                        $response['status'] = 403;
                        $response['message'] = "權限不足";
                    }
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
        }
        echo json_encode($response);
    }
}
?>