<?php
namespace Controllers;
use Vendor\Controller;
use Models\Account as AccountModel;

class Account extends Controller
{
    private $am;
    
    public function __construct() {
        $this->am = new AccountModel();
    }
    
    public function getUsers(){
        if (isset($_POST['uid'])) {
            $accountId = $_POST['uid'];
            return $this->am->getAccounts($accountId);
        } else {
            return $this->am->getAccounts();
        }
    }
    
    public function getUser(){
        return $this->getUser();
    }
    
    public function newUser(){
        $email = $_POST['email'];
        $password = $_POST['password'];
        $fullName = $_POST['name'];
        $addr = $_POST['addr'];
        $birth = $_POST['bir'];
        
        return $this->am->newAccount($email, $password, $fullName, $addr, $birth);
    }
    
    public function removeUser(){
        $accountId = $_POST['uid'];
        return $this->am->removeAccount($accountId);
    }
    
    public function updateUser(){
        $accountId = $_POST['uid'];
        $fullName = $_POST['name'];
        $addr = $_POST['addr'];
        $birth = $_POST['bir'];
        $password = isset($_POST['password']) ? $_POST['password'] : null;
        
        return $this->am->updateAccount($accountId, $fullName, $addr, $birth, $password);
    }
}
?>