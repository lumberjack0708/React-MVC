<?php
    require "vendor/autoload.php";
    require "genToken.php";
    
    $response = array();
    
    // 檢查是否有POST資料 (只使用 account_code 登入)
    if(isset($_POST['id']) && isset($_POST['password'])) {
        $id = $_POST['id'];
        $password = $_POST['password'];
        
        // 查詢DB驗證帳密的正確性
        // 連接MySQL資料庫
        $servername = "localhost";
        $username = "root";      
        $dbpassword = "";     
        $dbname = "petdeptstore";      

        $conn = new mysqli($servername, $username, $dbpassword, $dbname);
        if ($conn->connect_error) {
            http_response_code(500);
            $response["status"] = "error";
            $response["message"] = "資料庫連線失敗";
            $response["error_details"] = $conn->connect_error;
        } else {
            // 只用 account_code 登入
            $stmt = $conn->prepare("SELECT * FROM account WHERE account_code = ? AND password = ?");
            $stmt->bind_param("ss", $id, $password);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                
                // 使用獨立檔案生成Token
                $token = generateToken($user);
                
                $response["status"] = 200;
                $response["message"] = "登入成功";
                $response["token"] = $token;
                $response["user"] = array(
                    "account_id" => $user['account_id'],
                    "account_code" => $user['account_code'],
                    "email" => $user['email'],
                    "full_name" => $user['full_name'],
                    "role_id" => $user['role_id']
                );
            } else {
                // 驗證失敗
                http_response_code(401);
                $response["status"] = 401;
                $response["message"] = "帳號或密碼錯誤";
            }
            
            // 關閉連線
            $stmt->close();
            $conn->close();
        }
    } else {
        // 缺少必要參數
        http_response_code(400);
        $response["status"] = 400;
        $response["message"] = "缺少必要參數";
    }
    
    // 輸出JSON格式回應
    header('Content-Type: application/json');
    echo json_encode($response);
?>