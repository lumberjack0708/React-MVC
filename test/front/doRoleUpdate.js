import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doRoleUpdate(){
    const role_id = document.getElementById("role_id").value;
    const role_name = document.getElementById("role_name").value;
    
    let data = { role_id, role_name };
    
    Request().post("/index.php?action=updateRole", Qs.stringify(data))
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
                 // 延遲1秒後重新載入角色列表
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
                     `<div class="alert-message alert-error">${response.message}</div>`;
                 setTimeout(() => {
                     const event = new Event('click');
                     document.getElementById('role').dispatchEvent(event);
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
             document.getElementById('role').dispatchEvent(event);
         }, 1500);
    });
}