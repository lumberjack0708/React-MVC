import { getApiUrl } from "./config.js";

export default function doRoleUpdate(){
    const role_id = document.getElementById("role_id").value;
    const role_name = document.getElementById("role_name").value;
    
    let data = { role_id, role_name };
    
    axios.post(getApiUrl("updateRole"), Qs.stringify(data))
    .then(res => {
         let response = res.data;
         
         let alertClass = response.status === 200 ? 'alert-success' : 'alert-error';
         document.getElementById("content").innerHTML = 
             `<div class="alert-message ${alertClass}">${response.message}</div>`;
         
         // 無論成功或失敗，都延遲1秒後重新載入角色列表
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('role').dispatchEvent(event);
         }, 1500); // 延長時間讓用戶有機會看到錯誤訊息
    })
    .catch(err => {
         document.getElementById("content").innerHTML = "更新失敗：" + err;
         // 發生網路錯誤時也自動返回
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('role').dispatchEvent(event);
         }, 1500);
    });
}