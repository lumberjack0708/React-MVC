import Request from './Request.js';
import main from './main.js';
import doLogin from './doLogin.js';

window.onload = function(){
    if(window.localStorage){
        const token = window.localStorage.getItem("jwtToken");
        
        if(token) {
            Request().get("/check.php")
            .then(res => {
                const response = res.data;
                console.log("檢查回應：", response);
                
                if(response.status === 200){ 
                    main();
                } else {
                    // Token無效，清除並顯示登入頁面
                    window.localStorage.removeItem("jwtToken");
                    doLogin();
                }
            })
            .catch(err => {
                console.error("檢查錯誤：", err);
                window.localStorage.removeItem("jwtToken"); // 錯誤時也應清除token
                doLogin();
            });
        } else {
            // 沒有token直接顯示登入頁面
            doLogin();
        }
    } else {
        alert("您的瀏覽器不支援localStorage，部分功能可能無法正常使用");
    }
}
