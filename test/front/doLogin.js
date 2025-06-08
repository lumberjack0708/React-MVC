import Request from './Request.js';

export default function doLogin(){
    const sp = `
        帳號：<input type="text" id="id"><br>
        密碼：<input type="password" id="password"><br>
        <button id="login">登入</button>
        <div id="content"></div>
    `;
    document.getElementById("root").innerHTML = sp;
    document.getElementById("login").onclick = function(){
        const data = {
            "id": document.getElementById("id").value,
            "password": document.getElementById("password").value
        };
        const formData = Qs.stringify(data);
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        // 使用axios發送請求
        Request().post('/login.php', formData, config)
        .then(function(resp){
            let response = resp.data;
            console.log("登入回應：", response);
            
            if(response.status === 200){ 
                if(window.localStorage){ //儲存到 local storage
                    window.localStorage.setItem("jwtToken", response.token);
                    document.getElementById("content").innerHTML = "登入成功！";
                }
                // 延遲一秒後重新載入頁面
                setTimeout(() => {
                    location.reload();
                }, 50);
            } else {
                document.getElementById("content").innerHTML = response.message || "登入失敗";
            }
        })
        .catch(function(err){
            console.log("登入錯誤：", err);
            document.getElementById("content").innerHTML = "登入失敗，請檢查網路連接";
        });
    }
}
