import showSupplierInsertPage from "./showSupplierInsertPage.js";
import showSupplierUpdatePage from "./showSupplierUpdatePage.js";
import doSupplierDelete from "./doSupplierDelete.js";
import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function supplierInfo(){
    Request().get("/index.php?action=getSuppliers")
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
                          <th>供應商編號</th>
                          <th>供應商名稱</th>
                          <th>聯絡人</th>
                          <th class="hide-on-tablet">聯絡電話</th>
                          <th class="hide-on-tablet">地址</th>
                          <th style="text-align: center;"><button id='newSupplier' class="custom-btn">新增供應商</button></th>
                        </tr></thead>
                        <tbody>`;
                rows.forEach(element => {
                    str += `<tr>`;
                    // 使用兩種方式同時保存 sid 值
                    str += `<td name='sid' data-title="供應商編號">` + element['sid'] + `</td>`;
                    str += `<td data-title="供應商名稱">` + element['s_name'] + `</td>`;
                    str += `<td data-title="聯絡人">` + element['contact'] + `</td>`;
                    str += `<td class="hide-on-tablet" data-title="聯絡電話">` + element['tel'] + `</td>`;
                    str += `<td class="hide-on-tablet address" data-title="地址">` + element['address'] + `</td>`;
                    // 保留原有的按鈕設計，但同時添加 data-sid 屬性
                    str += `<td class="action-column" data-title="操作">
                            <button name='updateSupplier' class="custom-btn">修改</button>&ensp;
                            <button name='deleteSupplier' class="custom-btn delete-btn">刪除</button>
                           </td>`;
                    str += `</tr>`;
                });
                str += `</tbody></table>`;
                document.getElementById("content").innerHTML=str;
                
                //設定事件(新增供應商, 修改, 刪除) 
                document.getElementById("newSupplier").onclick = function(){ 
                    showSupplierInsertPage();
                };
                
                // 獲取所有供應商ID
                const sids = document.getElementsByName("sid");
                
                // 使用與 productInfo.js 相同的綁定方式
                const updateButtons = document.getElementsByName("updateSupplier");
                for(let i=0; i<updateButtons.length; i++){
                    updateButtons[i].onclick = function(){
                        showSupplierUpdatePage(sids[i].innerText);
                    };
                }
                
                const deleteButtons = document.getElementsByName("deleteSupplier");
                for(let i=0; i<deleteButtons.length; i++){
                    deleteButtons[i].onclick = function(){
                        doSupplierDelete(sids[i].innerText);
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