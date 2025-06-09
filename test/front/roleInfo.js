import showRoleInsertPage from "./showRoleInsertPage.js";
import showRoleUpdatePage from "./showRoleUpdatePage.js";
import doRoleDelete from "./doRoleDelete.js";
import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function roleInfo(){
    Request().get("/index.php?action=getRoles")
    .then(res => {
        let response = res['data'];
        switch(response['status']){
            case 200:
                //執行成功後的畫面處理
                if(window.localStorage){ //儲存到 local storage
                    window.localStorage.setItem("jwtToken", response['token']);
                }
                const rows = response['result'];
                //作畫面
                let str = `<br/><br/><table class="custom-table">`;
                str += `<thead><tr>
                          <th>角色編號</th>
                          <th>角色名稱</th>
                          <th>建立時間</th>
                          <th style="text-align: center;"><button id='newRole' class="custom-btn">新增角色</button></th>
                        </tr></thead>
                        <tbody>`;
                rows.forEach(element => {
                    str += `<tr>`;
                    str += `<td name='role_id' data-title="角色編號">` + element['role_id'] + `</td>`;
                    str += `<td data-title="角色名稱">` + element['role_name'] + `</td>`;
                    str += `<td data-title="建立時間">` + element['created_at'] + `</td>`;
                    str += `<td class="action-column" data-title="操作"><button name='updateRole' class="custom-btn">修改</button>&ensp;<button name='deleteRole' class="custom-btn delete-btn">刪除</button></td>`;
                    str += `</tr>`;
                });
                str += `</tbody></table>`;
                document.getElementById("content").innerHTML=str;
                
                //設定事件(新增角色, 修改, 刪除) 
                document.getElementById("newRole").onclick = function(){ 
                    showRoleInsertPage();
                };
                const role_ids = document.getElementsByName("role_id");
                
                const updateButtons = document.getElementsByName("updateRole");
                for(let i=0; i<updateButtons.length; i++){
                    updateButtons[i].onclick = function(){
                        showRoleUpdatePage(role_ids[i].innerText);
                    };
                }
                
                const deleteButtons = document.getElementsByName("deleteRole");
                for(let i=0; i<deleteButtons.length; i++){
                    deleteButtons[i].onclick = function(){
                        doRoleDelete(role_ids[i].innerText);
                    };
                }
                
                break;
            case 401:
                loginPage();
                break;
            default:
                document.getElementById("content").innerHTML=response['message'];
                break;
        }
    })
    .catch(err => {
        console.error(err);
    }) 
}