<?php
    namespace Vendor;
    // 抽象類別(abstrac class)：讓這個class變成一個不完整類別，只能被繼承，不能被實體化(new class)，避免被誤用
    abstract class Controller{
        // 每一個controller執行結束之後，強制執行標準化輸出
        // 將 protected 改為 protected static，使其成為靜態方法
        protected static function response($status, $message, $result=NULL, $insertId=NULL){
            $resp['status'] = $status;
            $resp['message'] = $message;
            $resp['result'] = $result;
            // 如果有 insert_id，則添加到回應中
            if ($insertId !== NULL) {
                $resp['insert_id'] = $insertId;
            }
            return $resp;
        }
    }
?>