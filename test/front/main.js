//import需要的js檔
// import startPage from './startPage.js';
import employeeInfo from './employeeInfo.js';
import productInfo from './productInfo.js';
import roleInfo from './roleInfo.js';
import supplierInfo from './supplierInfo.js';


export default function startPage(){
    const sp = `
        <button id="employee" class="custom-btn">員工資料</button>
        <button id="product" class="custom-btn">產品資料</button>
        <button id="role" class="custom-btn">角色</button>
        <button id="supplier" class="custom-btn">供應商資訊</button>
        <div id="content"></div>
    `;
    document.getElementById("root").innerHTML = sp;
    document.getElementById("employee").onclick = function(){
        employeeInfo();
    };
    document.getElementById("product").onclick = function(){
        productInfo();
    };
    document.getElementById("role").onclick = function(){
        roleInfo();
    };
    document.getElementById("supplier").onclick = function(){
        supplierInfo();
    };
}
