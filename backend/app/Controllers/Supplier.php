<?php
namespace Controllers;
use Vendor\DB;
use Vendor\Controller;
use Models\Supplier as SupplierModel;

class Supplier extends Controller
{
    private $sm;
    
    public function __construct() {
        $this->sm = new SupplierModel();
    }
    
    public function getSuppliers(){
        if (isset($_POST['sid'])) {
            $sid = $_POST['sid'];
            return $this->sm->getSupplier($sid);
        } else {
            return $this->sm->getSuppliers();
        }
    }
    
    public function getSupplier(){
        return $this->getSuppliers();
    }
    
    public function newSupplier(){
        $s_name = $_POST['s_name'];
        $contact = $_POST['contact'];
        $tel = $_POST['tel'];
        $address = $_POST['address'];
        
        return $this->sm->newSupplier($s_name, $contact, $tel, $address);
    }
    
    public function removeSupplier(){
        $sid = $_POST['sid'];
        return $this->sm->removeSupplier($sid);
    }
    
    public function updateSupplier(){
        $sid = $_POST['sid'];
        $s_name = $_POST['s_name'];
        $contact = $_POST['contact'];
        $tel = $_POST['tel'];
        $address = $_POST['address'];
        
        return $this->sm->updateSupplier($sid, $s_name, $contact, $tel, $address);
    }
}
?>