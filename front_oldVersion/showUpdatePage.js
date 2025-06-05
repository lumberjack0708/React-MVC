import doUpdate from './doUpdate.js';
import { getApiUrl } from "./config.js";

export default function showUpdatePage(id){
    if (!id) {
        document.getElementById("content").innerHTML = 
            `<div class="alert-message alert-error">錯誤：無法取得員工編號</div>`;
        console.error("員工 ID 未定義");
        return;
    }
    
    console.log("正在請求員工ID:", id);
    
    // 修正 API 請求方式，僅保留一種請求方法，並正確設置參數
    let data = {
        "id": id
    };
    
    axios.post(getApiUrl("getUsers"), Qs.stringify(data))
    .then(res => {
        console.log("API 回應:", res.data);
        let response = res['data'];  // 正確獲取回應
        switch(response['status']){
            case 200:
                const rows = response['result'];
                if (rows.length === 0) {
                    document.getElementById("content").innerHTML = 
                        `<div class="alert-message alert-error">找不到對應的員工資料</div>`;
                    return;
                }
                
                const row = rows[0];
                
                let str = `
                <div class="form-container">
                    <h2>修改員工資料</h2>
                    <table class="custom-table">
                        <tr>
                            <td>員工編號：</td>
                            <td><input type="text" id="id" value="${row['id']}" readonly></td>
                        </tr>
                        <tr>
                            <td>員工姓名：</td>
                            <td><input type="text" id="name" value="${row['name'] || ''}"></td>
                        </tr>
                        <tr>
                            <td>密碼：</td>
                            <td><input type="text" id="password" value="${row['password']}"></td>
                        </tr>
                        <tr>
                            <td>入職日期：</td>
                            <td><input type="date" id="JoinDate" value="${row['JoinDate']}"></td>
                        </tr>
                        <tr>
                            <td>住址：</td>
                            <td><input type="text" id="address" value="${row['address']}"></td>
                        </tr>
                        <tr>
                            <td>Email：</td>
                            <td><input type="text" id="email" value="${row['email']}"></td>
                        </tr>
                        <tr>
                            <td>電話：</td>
                            <td><input type="text" id="phone" value="${row['phone']}"></td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: center;">
                                <button id="doUpdate" class="custom-btn">確認修改</button>
                                <button id="backToList" class="custom-btn">返回列表</button>
                            </td>
                        </tr>
                    </table>
                </div>`;
                
                document.getElementById("content").innerHTML = str;
                document.getElementById("doUpdate").onclick = function(){
                    doUpdate();
                };
                document.getElementById("backToList").onclick = function(){
                    const event = new Event('click');
                    document.getElementById('employee').dispatchEvent(event);
                };
                break;
            default:
                document.getElementById("content").innerHTML = 
                    `<div class="alert-message alert-error">${response['message'] || "獲取員工資料失敗"}</div>`;
                break;
        }
    })
    .catch(err => {
        console.error("API 請求錯誤:", err);
        document.getElementById("content").innerHTML = 
            `<div class="alert-message alert-error">發生錯誤: ${err}</div>`;  
    });          
}