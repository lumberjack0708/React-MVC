import doRoleUpdate from './doRoleUpdate.js';
import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function showRoleUpdatePage(role_id){
    let data = {
        "role_id": role_id,
    };

    Request().post("/index.php?action=getRoles", Qs.stringify(data))
    .then(res => {
        let response = res['data'];
        switch(response['status']){
            case 200:
                //執行成功後的畫面處理
                if(window.localStorage){ //儲存到 local storage
                    window.localStorage.setItem("jwtToken", response['token']);
                }
                const rows = response['result'];
                const row = rows[0];
                
                let str = `<h2>修改角色資料</h2>`;
                str += `<table class="custom-table">`;
                str += `<tr>
                          <td>角色編號：</td>
                          <td><input type="text" id="role_id" value="${row['role_id']}" readonly></td>
                        </tr>`;
                str += `<tr>
                          <td>角色名稱：</td>
                          <td><input type="text" id="role_name" value="${row['role_name']}"></td>
                        </tr>`;
                str += `<tr>
                          <td>建立時間：</td>
                          <td><input type="text" value="${row['created_at']}" readonly></td>
                        </tr>`;
                str += `<tr>
                          <td colspan="2" style="text-align: center;">
                            <button id="doUpdate" class="custom-btn">確認修改</button>
                            <button id="backToList" class="custom-btn">返回列表</button>
                          </td>
                        </tr>`;
                str += `</table>`;
                
                document.getElementById("content").innerHTML = str;
                document.getElementById("doUpdate").onclick = function(){
                    doRoleUpdate();
                };
                document.getElementById("backToList").onclick = function(){
                    const event = new Event('click');
                    document.getElementById('role').dispatchEvent(event);
                };
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