<?php
namespace Models;
use Vendor\DB;

class Action{
    public function getRoles($action){
        // 找這個動作有誰能做，回傳role_id
        $sql = "SELECT role_action.role_id  
                FROM  `action`, `role_action` 
                WHERE  action.name=? and role_action.action_id=action.id";
        $arg = array($action);
        $response = DB::select($sql, $arg);
        $result = $response['result'];
        for ($i=0; $i < count($result); $i++) { 
            $result[$i] = $result[$i]['role_id'];    
        }
        $response['result'] = $result;
        return $response;
    }
}
?>