<?php
require "vendor/autoload.php";
use \Firebase\JWT\JWT;

function generateToken($userData) {
    $secret_key = "1234"; //密鑰
    $issuer_claim = "http://localhost";
    $audience_claim = "http://localhost";
    $issuedat_claim = time(); // issued at
    $expire_claim = $issuedat_claim + 3600; 
    
    $payload = array(
        "iss" => $issuer_claim,
        "aud" => $audience_claim,
        "iat" => $issuedat_claim,
        "exp" => $expire_claim,
        "data" => array(
            "account_id" => $userData['account_id'],    
            "account_code" => $userData['account_code'],
            "email" => $userData['email'],
            "full_name" => $userData['full_name'],
            "role_id" => $userData['role_id']
        )
    );
    
    return JWT::encode($payload, $secret_key, 'HS256');
}
?>
