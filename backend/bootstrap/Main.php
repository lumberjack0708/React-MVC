<?php
require_once __DIR__ . '/../vendor/autoload.php';

use vendor\DB;
use vendor\Router;
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

        //檢查帳密(以後說明)
        //判斷權限(以後說明)

        $router = new Router();
        require_once __DIR__ . "/../routes/web.php"; // 引入路由設定檔
        $response = $router->run($action);

        echo json_encode($response);
    }
}
?>