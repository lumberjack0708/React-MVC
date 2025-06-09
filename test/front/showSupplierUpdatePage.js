import doSupplierUpdate from './doSupplierUpdate.js';
import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function showSupplierUpdatePage(sid){
    if (!sid) {
        console.error("供應商 ID 未定義");
        document.getElementById("content").innerHTML = "無法修改：供應商 ID 未定義";
        return;
    }
    
    let data = {
        "sid": sid,
    };
    
    console.log("正在請求供應商數據，ID:", sid);
    
    Request().post("/index.php?action=getSuppliers", Qs.stringify(data))
    .then(res => {
        console.log("API 回應:", res.data);
        let response = res['data'];
        switch(response['status']){
            case 200:
                //執行成功後的畫面處理
                if(window.localStorage){ //儲存到 local storage
                    window.localStorage.setItem("jwtToken", response['token']);
                }
                const rows = response['result'];
                if (rows.length === 0) {
                    document.getElementById("content").innerHTML = "找不到對應的供應商資料";
                    return;
                }
                
                const row = rows[0];
                
                let str = `<h2>修改供應商資料</h2>`;
                str += `<table class="custom-table">`;
                str += `<tr>
                          <td>供應商編號：</td>
                          <td><input type="text" id="sid" value="${row['sid']}" readonly></td>
                        </tr>`;
                str += `<tr>
                          <td>供應商名稱：</td>
                          <td><input type="text" id="s_name" value="${row['s_name']}"></td>
                        </tr>`;
                str += `<tr>
                          <td>聯絡人：</td>
                          <td><input type="text" id="contact" value="${row['contact'] || ''}"></td>
                        </tr>`;
                str += `<tr>
                          <td>聯絡電話：</td>
                          <td><input type="text" id="tel" value="${row['tel'] || ''}" maxlength="10"></td>
                        </tr>`;
                str += `<tr>
                          <td>地址：</td>
                          <td><input type="text" id="address" value="${row['address'] || ''}"></td>
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
                    doSupplierUpdate();
                };
                document.getElementById("backToList").onclick = function(){
                    const event = new Event('click');
                    document.getElementById('supplier').dispatchEvent(event);
                };
                break;
            case 401:
                loginPage();
                break;
            default:
                document.getElementById("content").innerHTML = response['message'] || "獲取供應商資料失敗";
                break;
        }
    })
    .catch(err => {
        console.error("API 請求錯誤:", err);
        document.getElementById("content").innerHTML = "發生錯誤: " + err;  
    });          
}