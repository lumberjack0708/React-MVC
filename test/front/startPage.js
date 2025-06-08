export default function startPage(){
    const sp = `
        帳號：<input type="text" id="id"><br>
        密碼：<input type="password" id="password"><br>
        <button id="login">登入</button>
        <button id="checkToken">檢查</button>
        <div id="content"></div>
    `;
    return sp;
}
