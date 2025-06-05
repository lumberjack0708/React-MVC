import { getApiUrl } from "./config.js";

export default function doProductUpdate(){
    let pid = document.getElementById("pid").value;
    let p_name = document.getElementById("p_name").value;
    let cost = document.getElementById("cost").value;
    let price = document.getElementById("price").value;
    let stock = document.getElementById("stock").value;
    
    let data = { pid, p_name, cost, price, stock };
    
    axios.post(getApiUrl("updateProduct"), Qs.stringify(data))
    .then(res => {
         let response = res.data;
         if(response.status === 200){
             document.getElementById("content").innerHTML = "更新成功";
             // 成功後延遲1秒重新載入產品列表
             setTimeout(() => {
                 const event = new Event('click');
                 document.getElementById('product').dispatchEvent(event);
             }, 1000);
         } else {
             document.getElementById("content").innerHTML = "更新失敗：" + response.message;
         }
    })
    .catch(err => {
         document.getElementById("content").innerHTML = "更新失敗：" + err;
    });
}