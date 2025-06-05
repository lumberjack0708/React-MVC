import { getApiUrl } from "./config.js";

export default function doSupplierUpdate(){
    let sid = document.getElementById("sid").value;
    let s_name = document.getElementById("s_name").value;
    let contact = document.getElementById("contact").value;
    let tel = document.getElementById("tel").value;
    let address = document.getElementById("address").value;
    
    // 簡單驗證
    if (!s_name) {
        document.getElementById("content").innerHTML = "供應商名稱不可為空";
        return;
    }
    
    if (!address) {
        document.getElementById("content").innerHTML = "供應商地址不可為空";
        return;
    }
    
    let data = { sid, s_name, contact, tel, address };
    
    axios.post(getApiUrl("updateSupplier"), Qs.stringify(data))
    .then(res => {
         let response = res.data;
         
         let alertClass = response.status === 200 ? 'alert-success' : 'alert-error';
         document.getElementById("content").innerHTML = 
             `<div class="alert-message ${alertClass}">${response.message}</div>`;
         
         // 無論成功或失敗，都延遲1.5秒後重新載入供應商列表
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('supplier').dispatchEvent(event);
         }, 1500);
    })
    .catch(err => {
         document.getElementById("content").innerHTML = "更新失敗：" + err;
         // 發生網路錯誤時也自動返回
         setTimeout(() => {
             const event = new Event('click');
             document.getElementById('supplier').dispatchEvent(event);
         }, 1500);
    });
}