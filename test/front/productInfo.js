import showProductInsertPage from "./showProductInsertPage.js";
import showProductUpdatePage from "./showProductUpdatePage.js";
import doProductDelete from "./doProductDelete.js";
import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function productInfo(){
    Request().get("/index.php?action=getProducts")
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
                          <th>產品編號</th>
                          <th>產品名稱</th>
                          <th>成本</th>
                          <th>售價</th>
                          <th>庫存數量</th>
                          <th style="text-align: center;"><button id='newProduct' class="custom-btn">新增產品</button></th>
                        </tr></thead>
                        <tbody>`;
                rows.forEach(element => {
                    str += `<tr>`;
                    str += `<td name='pid' data-title="產品編號">` + element['pid'] + `</td>`;
                    str += `<td data-title="產品名稱">` + element['p_name'] + `</td>`;
                    str += `<td data-title="成本">` + element['cost'] + `</td>`;
                    str += `<td data-title="售價">` + element['price'] + `</td>`;
                    str += `<td data-title="庫存數量">` + element['stock'] + `</td>`;
                    str += `<td class="action-column" data-title="操作"><button name='updateProduct' class="custom-btn">修改</button>&ensp;<button name='deleteProduct' class="custom-btn delete-btn">刪除</button></td>`;
                    str += `</tr>`;
                });
                str += `</tbody></table>`;
                document.getElementById("content").innerHTML=str;
                
                //設定事件(新增產品, 修改, 刪除) 
                document.getElementById("newProduct").onclick = function(){ 
                    showProductInsertPage();
                };
                const pids = document.getElementsByName("pid");
                
                const updateButtons = document.getElementsByName("updateProduct");
                for(let i=0; i<updateButtons.length; i++){
                    updateButtons[i].onclick = function(){
                        showProductUpdatePage(pids[i].innerText);
                    };
                }
                
                const deleteButtons = document.getElementsByName("deleteProduct");
                for(let i=0; i<deleteButtons.length; i++){
                    deleteButtons[i].onclick = function(){
                        doProductDelete(pids[i].innerText);
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