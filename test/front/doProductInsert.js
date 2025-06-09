import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doProductInsert(){
    let data = {
         "p_name": document.getElementById("p_name").value,
         "cost": document.getElementById("cost").value,
         "price": document.getElementById("price").value,
         "stock": document.getElementById("stock").value
     };
     
     Request().post("/index.php?action=newProduct", Qs.stringify(data))
     .then(res => {
         let response = res['data'];
         switch(response['status']){
             case 200:
                 //執行成功後的畫面處理
                 if(window.localStorage){ //儲存到 local storage
                     window.localStorage.setItem("jwtToken", response['token']);
                 }
                 document.getElementById("content").innerHTML = response['message'];
                 // 成功後延遲1秒重新載入產品列表
                 setTimeout(() => {
                     const event = new Event('click');
                     document.getElementById('product').dispatchEvent(event);
                 }, 1000);
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