import { getApiUrl } from "./config.js";

export default function doSupplierInsert(){
    let data = {
         "s_name": document.getElementById("s_name").value,
         "contact": document.getElementById("contact").value,
         "tel": document.getElementById("tel").value,
         "address": document.getElementById("address").value
     };
     
     // 簡單驗證
     if (!data.s_name) {
         document.getElementById("content").innerHTML = "供應商名稱不可為空";
         return;
     }
     
     if (!data.address) {
         document.getElementById("content").innerHTML = "供應商地址不可為空";
         return;
     }
     
     axios.post(getApiUrl("newSupplier"), Qs.stringify(data))
     .then(res => {
         let response = res['data'];
         
         let alertClass = response['status'] === 200 ? 'alert-success' : 'alert-error';
         document.getElementById("content").innerHTML = 
             `<div class="alert-message ${alertClass}">${response['message']}</div>`;
         
         // 無論成功或失敗，都延遲1.5秒後重新載入供應商列表
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('supplier').dispatchEvent(event);
         }, 1500);
     })
     .catch(err => {
         document.getElementById("content").innerHTML = "發生錯誤: " + err;
         // 發生網路錯誤時也自動返回
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('supplier').dispatchEvent(event);
         }, 1500);
     });
}