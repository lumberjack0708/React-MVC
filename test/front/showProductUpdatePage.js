import doProductUpdate from './doProductUpdate.js';
import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function showProductUpdatePage(pid){
    let data = {
        "pid": pid,
    };
    
    Request().post("/index.php?action=getProducts", Qs.stringify(data))
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
                
                let str = `<h2>修改產品資料</h2>`;
                str += `<table class="custom-table">`;
                str += `<tr>
                          <td>產品編號：</td>
                          <td><input type="text" id="pid" value="${row['pid']}" readonly></td>
                        </tr>`;
                str += `<tr>
                          <td>產品名稱：</td>
                          <td><input type="text" id="p_name" value="${row['p_name']}"></td>
                        </tr>`;
                str += `<tr>
                          <td>成本：</td>
                          <td><input type="number" id="cost" value="${row['cost']}"></td>
                        </tr>`;
                str += `<tr>
                          <td>售價：</td>
                          <td><input type="number" id="price" value="${row['price']}"></td>
                        </tr>`;
                str += `<tr>
                          <td>庫存數量：</td>
                          <td><input type="number" id="stock" value="${row['stock']}"></td>
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
                    doProductUpdate();
                };
                document.getElementById("backToList").onclick = function(){
                    const event = new Event('click');
                    document.getElementById('product').dispatchEvent(event);
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