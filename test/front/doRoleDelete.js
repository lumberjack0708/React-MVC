import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doRoleDelete(role_id){
    if(confirm("確定要刪除這個角色嗎？")) {
        let data = {
            "role_id": role_id,
        };
        Request().post("/index.php?action=removeRole", Qs.stringify(data))
        .then(res => {
            let response = res['data'];
            switch(response['status']){
                case 200:
                    //執行成功後的畫面處理
                    if(window.localStorage){ //儲存到 local storage
                        window.localStorage.setItem("jwtToken", response['token']);
                    }
                    document.getElementById("content").innerHTML = response['message'];
                    // 成功後延遲1秒重新載入角色列表
                    setTimeout(() => {
                        const event = new Event('click');
                        document.getElementById('role').dispatchEvent(event);
                    }, 1000);
                    break;
                case 401:
                    loginPage();
                    break;
                default:
                    document.getElementById("content").innerHTML = response['message'];
                    break;
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById("content").innerHTML = err;
        });
    }
}