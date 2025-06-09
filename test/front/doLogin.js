import Request from './Request.js';
export default function loginPage(){
    const sp = `
        帳號：<input type="text" id="id"><br>
        密碼：<input type="password" id="password"><br>
        <button id="login">登入</button>
        <div id="content"></div>
    `;
    document.getElementById("root").innerHTML = sp;
    document.getElementById("login").onclick = function(){
        const data={
            "id": document.getElementById("id").value,
            "password": document.getElementById("password").value
        };
        Request().post('/index.php?action=doLogin', Qs.stringify(data))
        .then(function(resp){
            let response = resp['data'];
            switch(response['status']){
                case 200:
                    //執行成功後的畫面處理
                    if(window.localStorage){ //儲存到 local storage
                        window.localStorage.setItem("jwtToken", response['token']);
                    }
                    document.getElementById("content").innerHTML = 
                        `<div style="color: green;">${response['message']}</div>`;
                    // 延遲1秒後重新載入頁面
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                    break;
                case 401:
                    document.getElementById("content").innerHTML = 
                        `<div style="color: red;">${response['message']}</div>`;
                    // 清空輸入欄位
                    document.getElementById("id").value = "";
                    document.getElementById("password").value = "";
                    break;
                default:
                    document.getElementById("content").innerHTML = 
                        `<div style="color: red;">${response['message'] || '登入時發生錯誤'}</div>`;
                    break;
            }
        })
        .catch(function(err){
            console.error(err);
            document.getElementById("content").innerHTML = 
                `<div style="color: red;">網路連線錯誤</div>`;
        });
    }
}
