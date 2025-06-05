import { getApiUrl } from "./config.js";

export default function doProductInsert(){
    let data = {
         "p_name": document.getElementById("p_name").value,
         "cost": document.getElementById("cost").value,
         "price": document.getElementById("price").value,
         "stock": document.getElementById("stock").value
     };
     
     axios.post(getApiUrl("newProduct"), Qs.stringify(data))
     .then(res => {
         let response = res['data'];
         document.getElementById("content").innerHTML = response['message'];
         // 成功後延遲1秒重新載入產品列表
         if(response['status'] === 200) {
             setTimeout(() => {
                 const event = new Event('click');
                 document.getElementById('product').dispatchEvent(event);
             }, 1000);
         }
     })
     .catch(err => {
         document.getElementById("content").innerHTML = err;  
     });
}