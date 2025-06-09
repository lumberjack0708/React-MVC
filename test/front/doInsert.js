import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

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
    
    Request().post("/index.php?action=newUser", Qs.stringify(data))
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
                // 延遲1.5秒後重新載入員工列表
                setTimeout(() => {
                    const event = new Event('click');
                    document.getElementById('employee').dispatchEvent(event);
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
                    document.getElementById('employee').dispatchEvent(event);
                }, 1500);
                break;
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("content").innerHTML = 
            `<div class="alert-message alert-error">發生錯誤: ${err}</div>`;
        
        setTimeout(() => {
            const event = new Event('click');
            document.getElementById('employee').dispatchEvent(event);
        }, 1500);
    });
}
