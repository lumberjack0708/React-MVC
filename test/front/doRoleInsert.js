import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doRoleInsert(){
    let data = {
         "role_name": document.getElementById("role_name").value
     };
     
     Request().post("/index.php?action=newRole", Qs.stringify(data))
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
                 setTimeout(() => {
                     const event = new Event('click');
                     document.getElementById('role').dispatchEvent(event);
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
                     document.getElementById('role').dispatchEvent(event);
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
             document.getElementById('role').dispatchEvent(event);
         }, 1500);
     });
}