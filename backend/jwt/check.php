<?php
    require "vendor/autoload.php";
    use \Firebase\JWT\JWT;
    use \Firebase\JWT\Key;
    
    // 初始化回應陣列
    $response = array();
    
    $headers = getallheaders();
    
    // 檢查Auth標頭是否存在
    if (isset($headers['Auth'])) {
        $jwt = $headers['Auth'];
        $secret_key = "1234";
        try {
            $payload = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            
            $response["status"] = 200;
            $response["message"] = "Token有效";
            $response["data"] = $payload->data;
            
        } catch (Exception $e) {
            http_response_code(401);
            $response["status"] = 401;
            $response["message"] = "Token無效或失效: " . $e->getMessage();
        }
    } else {
        http_response_code(401);
        $response["status"] = 401;
        $response["message"] = "缺少Auth標頭";
    }
    
    // 輸出JSON格式回應
    header('Content-Type: application/json');
    echo json_encode($response);
?>  