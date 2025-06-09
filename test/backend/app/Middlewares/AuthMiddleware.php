<?php
namespace Middlewares;
use \Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Vendor\Controller;
use Vendor\DB;

class AuthMiddleware extends Controller{
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
            $jwt = self::genToken($payload->data->id);
            $response['status'] = 200;
            $response['message'] = "Access granted";
            $response['token'] = $jwt;
        } catch (Exception $e) {
            $response['status'] = 403;
            $response['message'] = $e->getMessage();
        }
        return $response;
    }
    public static function doLogin(){
        $id = $_POST['id'];
        $password = $_POST['password'];
        
        // 使用現有的 DB 類別 
        // 支援兩種登入方式：使用者名稱或ID
        $sql = "SELECT * FROM user WHERE id = ? AND `password` = ?";
        $result = DB::select($sql, [$id, $password]);
        
        if($result['status'] == 200){
            $user = $result['result'][0];
            
            // 生成Token
            $token = self::genToken($user['id']);
            
            $response["status"] = 200;
            $response["message"] = "登入成功";
            $response["token"] = $token;
            $response["user"] = array(
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email']
                // 移除密碼欄位以確保安全性
            );
        } else if($result['status'] == 14) {
            // 資料庫連線失敗
            http_response_code(500);
            $response["status"] = "error";
            $response["message"] = "資料庫連線失敗";
        } else {
            // 驗證失敗
            http_response_code(401);
            $response["status"] = 401;
            $response["message"] = "帳號或密碼錯誤";
        }
        return $response;
    }
    private static function genToken($id){
        $secret_key = "1234";
        $issuer_claim = "http://localhost";
        $audience_claim = "http://localhost";
        $issuedat_claim = time(); // issued at
        $expire_claim = $issuedat_claim + 60;
        $payload = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "exp" => $expire_claim,
            "data" => array(
                "id" => $id,
            )
        );
        $jwt = JWT::encode($payload, $secret_key, 'HS256');
        return $jwt;

    }
}

?>