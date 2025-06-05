<?php
namespace app\Controllers;
use vendor\DB;
use vendor\Controller;
use app\Models\User as UserModel;

class User extends Controller
{
    private $um;
    
    public function __construct() {
        $this->um = new UserModel();
    }
    
    public function getUsers(){
        if (isset($_POST['uid'])) {
            $uid = $_POST['uid'];
            return $this->um->getUser($uid);
        } else {
            return $this->um->getUsers();
        }
    }
    
    public function getUser(){
        return $this->getUser();
    }
    
    public function newUser(){
        $password = $_POST['password'];
        $name = $_POST['name'];
        $addr = $_POST['addr'];
        $bir = $_POST['bir'];
        
        return $this->um->newUser($password, $name, $addr, $bir);
    }
    
    public function removeUser(){
        $uid = $_POST['uid'];
        return $this->um->removeUser($uid);
    }
    
    public function updateUser(){
        $uid = $_POST['uid'];
        $password = $_POST['password'];
        $name = $_POST['name'];
        $addr = $_POST['addr'];
        $bir = $_POST['bir'];
        
        return $this->um->updateUser($uid, $name, $addr, $bir, $password);
    }
}
?>