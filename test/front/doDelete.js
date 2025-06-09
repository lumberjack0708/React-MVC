import { getApiUrl } from "./config.js";
import Request from "./Request.js";
import loginPage from "./doLogin.js";

export default function doDelete(id){
    // let idValue;
    // for(let i=0; i<id.length; i++){
    //     if(id[i].checked){
    //         idValue = id[i].value;
    //     }
    // };
    let data = {
        "id": id,
    };
    Request().post("/index.php?action=removeUser", Qs.stringify(data))
    .then(res => {
        let response = res['data'];
        switch(response['status']){
            case 200:
                //執行成功後的畫面處理
                if(window.localStorage){ //儲存到 local storage
                    window.localStorage.setItem("jwtToken", response['token']);
                }
                document.getElementById("content").innerHTML = response['message'];
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
    })          
}
