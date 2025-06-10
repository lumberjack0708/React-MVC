<?php
namespace Middlewares;
use \Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Vendor\Controller;
use Vendor\DB;
// 匯入權限控管
use Models\Account as AccountModel;
use Models\Action;

class AuthMiddleware extends Controller{
    // 開始檢查權限
    private static $id;

    public static function checkPermission($action){
        
        
    }
    
    public static function checkToken(){
        $headers = getallheaders();
        
        // 檢查是否有 Auth header
        if (!isset($headers['Auth']) || empty($headers['Auth'])) {
            $response['status'] = 401;
            $response['message'] = "Missing authentication token";
            return $response;
        }
        
        $jwt = $headers['Auth'];
        $secret_key = "1234";
        try {
            $payload = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            $accountId = $payload->data->account_id;

            // 根據 token 中的 account_id 獲取用戶資料
            $sql = "SELECT account_id, account_code, role_id, email, full_name, addr, birth FROM account WHERE account_id = ?";
            $userResult = DB::select($sql, [$accountId]);

            if (empty($userResult['result'])) {
                throw new Exception('找不到此 token 對應的用戶');
            }
            $user = $userResult['result'][0];

            $jwt = self::genToken($payload->data->account_id);
            $response['status'] = 200;
            $response['message'] = "Access granted";
            $response['token'] = $jwt;
            $response['user'] = $user; // 在回應中加入用戶資料
        } catch (Exception $e) {
            $response['status'] = 403;
            $response['message'] = $e->getMessage();
        }
        return $response;
    }
    
    public static function doLogin(){
        // 檢查必要參數
        if (!isset($_POST['account_code']) || !isset($_POST['password'])) {
            $response["status"] = 400;
            $response["message"] = "請提供帳號密碼";
            return $response;
        }
        
        $account_code = $_POST['account_code'];
        $password = $_POST['password'];
        
        // 使用 account_code 登入
        $sql = "SELECT account_id, account_code, role_id, email, full_name, addr, birth FROM account WHERE account_code = ? AND password = ?";
        $result = DB::select($sql, [$account_code, $password]);
        
        if($result['status'] == 200 && !empty($result['result'])){
            $user = $result['result'][0];
            
            // 生成Token
            $token = self::genToken($user['account_id']);
            
            $response["status"] = 200;
            $response["message"] = "登入成功";
            $response["token"] = $token;
            $response["user"] = array(
                "account_id" => $user['account_id'],
                "account_code" => $user['account_code'],
                "role_id" => $user['role_id'],
                "full_name" => $user['full_name'],
                "email" => $user['email'],
                "addr" => $user['addr'],
                "birth" => $user['birth']
            );
        } else if($result['status'] == 14) {
            // 資料庫連線失敗
            http_response_code(500);
            $response["status"] = 500;
            $response["message"] = "資料庫連線失敗";
        } else {
            // 驗證失敗
            http_response_code(401);
            $response["status"] = 401;
            $response["message"] = "帳號或密碼錯誤";
        }
        return $response;
    }
    
    private static function genToken($account_id){
        $secret_key = "1234";
        $issuer_claim = "http://localhost";
        $audience_claim = "http://localhost";
        $issuedat_claim = time();
        $expire_claim = $issuedat_claim + 3600; // 1小時
        $payload = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "exp" => $expire_claim,
            "data" => array(
                "account_id" => $account_id,
            )
        );
        $jwt = JWT::encode($payload, $secret_key, 'HS256');
        return $jwt;
    }
}
?>