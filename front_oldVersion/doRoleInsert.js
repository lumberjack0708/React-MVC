import { getApiUrl } from "./config.js";

export default function doRoleInsert(){
    let data = {
         "role_name": document.getElementById("role_name").value
     };
     
     axios.post(getApiUrl("newRole"), Qs.stringify(data))
     .then(res => {
         let response = res['data'];
         
         let alertClass = response['status'] === 200 ? 'alert-success' : 'alert-error';
         document.getElementById("content").innerHTML = 
             `<div class="alert-message ${alertClass}">${response['message']}</div>`;
         
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('role').dispatchEvent(event);
         }, 1500); // 延長時間讓用戶有機會看到錯誤訊息
     })
     .catch(err => {
         document.getElementById("content").innerHTML = "發生錯誤: " + err;
         // 發生網路錯誤時也自動返回
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('role').dispatchEvent(event);
         }, 1500);
     });
}