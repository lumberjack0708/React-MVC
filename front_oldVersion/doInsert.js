import { getApiUrl } from "./config.js";

export default function doInsert(){
    let data = {
         // 取得所有表單資料，包括新增的欄位
         "name": document.getElementById("name").value,
         "password": document.getElementById("password").value,
         "JoinDate": document.getElementById("JoinDate").value,
         "address": document.getElementById("address").value,
         "email": document.getElementById("email").value,
         "phone": document.getElementById("phone").value
     };
     
     // 簡單驗證
     if (!data.name) {
         document.getElementById("content").innerHTML = 
             `<div class="alert-message alert-error">員工姓名不可為空</div>`;
         return;
     }
     
     if (!data.password) {
         document.getElementById("content").innerHTML = 
             `<div class="alert-message alert-error">密碼不可為空</div>`;
         return;
     }
    
    axios.post(getApiUrl("newUser"), Qs.stringify(data))
    .then(res => {
        let response = res['data'];
        
        let alertClass = response['status'] === 200 ? 'alert-success' : 'alert-error';
        document.getElementById("content").innerHTML = 
            `<div class="alert-message ${alertClass}">${response['message']}</div>`;
        
        // 無論成功或失敗，都延遲1.5秒後重新載入員工列表
        setTimeout(() => {
            const event = new Event('click');
            document.getElementById('employee').dispatchEvent(event);
        }, 1500);
    })
    .catch(err => {
        document.getElementById("content").innerHTML = 
            `<div class="alert-message alert-error">發生錯誤: ${err}</div>`;
        
        setTimeout(() => {
            const event = new Event('click');
            document.getElementById('employee').dispatchEvent(event);
        }, 1500);
    });
}
