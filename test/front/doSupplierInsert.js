import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doSupplierInsert(){
    let data = {
         "s_name": document.getElementById("s_name").value,
         "contact": document.getElementById("contact").value,
         "tel": document.getElementById("tel").value,
         "address": document.getElementById("address").value
     };
     
     // 簡單驗證
     if (!data.s_name) {
         document.getElementById("content").innerHTML = "供應商名稱不可為空";
         return;
     }
     
     if (!data.address) {
         document.getElementById("content").innerHTML = "供應商地址不可為空";
         return;
     }
     
     Request().post("/index.php?action=newSupplier", Qs.stringify(data))
     .then(res => {
         let response = res['data'];
         switch(response['status']){
             case 200:
                 //執行成功後的畫面處理
                 if(window.localStorage){ //儲存到 local storage
                     window.localStorage.setItem("jwtToken", response['token']);
                 }
                 document.getElementById("content").innerHTML = 
                     `<div class="alert-message alert-success">${response['message']}</div>`;
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
                     `<div class="alert-message alert-error">${response['message']}</div>`;
                 setTimeout(() => {
                     const event = new Event('click');
                     document.getElementById('supplier').dispatchEvent(event);
                 }, 1500);
                 break;
         }
     })
     .catch(err => {
         console.error(err);
         document.getElementById("content").innerHTML = "發生錯誤: " + err;
         // 發生網路錯誤時也自動返回
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('supplier').dispatchEvent(event);
         }, 1500);
     });
}