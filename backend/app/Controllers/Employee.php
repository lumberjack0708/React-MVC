<?php
namespace app\Controllers;
use vendor\DB;
use vendor\Controller;
use app\Models\Employee as EmployeeModel;

class Employee extends Controller
{
    private $em;
    public function __construct() {
        $this->em = new EmployeeModel();
    }

    public function getUsers(){
        if (isset($_POST['id']) || isset($_GET['id'])) {
            $id = isset($_POST['id']) ? $_POST['id'] : $_GET['id'];
            return $this->em->getUser($id);
        } else {
            $sql = "SELECT  *  FROM  `user`";
            $arg = NULL;
        }
        return DB::select($sql, $arg);              
    }

    public function newUser(){
        $name = $_POST['name'];
        $password = $_POST['password'];
        $JoinDate = $_POST['JoinDate'];
        $address = $_POST['address'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];

        return $this->em->newUser($name, $password, $JoinDate,$address, $email, $phone);
    }
    public function removeUser(){
        $id = $_POST['id'];

        return $this->em->removeUser($id);   
    }

    public function updateUser(){
        $id = $_POST['id'];
        $name = $_POST['name'];
        $password = $_POST['password'];
        $JoinDate = $_POST['JoinDate'];
        $address = $_POST['address'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];

        return $this->em->updateUser($id, $name, $password, $JoinDate,$address, $email, $phone);
    }

}

?>