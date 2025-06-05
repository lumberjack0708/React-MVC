<?php
namespace app\Controllers;
use vendor\DB;
use vendor\Controller;
use app\Models\Role as RoleModel;

class Role extends Controller
{
    private $rm; 
    
    public function __construct() {
        $this->rm = new RoleModel();
    }
    
    public function getRoles(){
        if (isset($_POST['role_id'])) {
            $role_id = $_POST['role_id'];
            return $this->rm->getRole($role_id);
        } else {
            return $this->rm->getRoles();
        }
    }
    
    public function getRole(){
        return $this->getRoles();
    }
    
    public function newRole(){
        $role_name = $_POST['role_name'];
        
        return $this->rm->newRole($role_name);
    }
    
    public function removeRole(){
        $role_id = $_POST['role_id'];
        return $this->rm->removeRole($role_id);
    }
    
    public function updateRole(){
        $role_id = $_POST['role_id'];
        $role_name = $_POST['role_name'];
        
        return $this->rm->updateRole($role_id, $role_name);
    }
}
?>