<?php
require "vendor/autoload.php";
use \Firebase\JWT\JWT;

function generateToken($userData) {
    $secret_key = "1234"; //密鑰
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
            "uid" => $userData['uid'],    
            "acc" => $userData['acc']     
        )
    );
    
    return JWT::encode($payload, $secret_key, 'HS256');
}
?>
