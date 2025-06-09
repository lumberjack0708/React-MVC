import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doSupplierUpdate(){
    let sid = document.getElementById("sid").value;
    let s_name = document.getElementById("s_name").value;
    let contact = document.getElementById("contact").value;
    let tel = document.getElementById("tel").value;
    let address = document.getElementById("address").value;
    
    // 簡單驗證
    if (!s_name) {
        document.getElementById("content").innerHTML = "供應商名稱不可為空";
        return;
    }
    
    if (!address) {
        document.getElementById("content").innerHTML = "供應商地址不可為空";
        return;
    }
    
    let data = { sid, s_name, contact, tel, address };
    
    Request().post("/index.php?action=updateSupplier", Qs.stringify(data))
    .then(res => {
         let response = res.data;
         switch(response['status']){
             case 200:
                 //執行成功後的畫面處理
                 if(window.localStorage){ //儲存到 local storage
                     window.localStorage.setItem("jwtToken", response['token']);
                 }
                 document.getElementById("content").innerHTML = 
                     `<div class="alert-message alert-success">${response.message}</div>`;
                 // 延遲1.5秒後重新載入供應商列表
                 setTimeout(() => {
                     const event = new Event('click');
                     document.getElementById('supplier').dispatchEvent(event);
                 }, 1500);
                 break;
             case 401:
                 loginPage();
                 break;
             default:
                 document.getElementById("content").innerHTML = 
                     `<div class="alert-message alert-error">${response.message}</div>`;
                 setTimeout(() => {
                     const event = new Event('click');
                     document.getElementById('supplier').dispatchEvent(event);
                 }, 1500);
                 break;
         }
    })
    .catch(err => {
         console.error(err);
         document.getElementById("content").innerHTML = "更新失敗：" + err;
         // 發生網路錯誤時也自動返回
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('supplier').dispatchEvent(event);
         }, 1500);
    });
}