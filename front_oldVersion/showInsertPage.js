import doInsert from './doInsert.js';

export default function showInsertPage(){
    let str = `
        <div class="form-container">
            <h2>新增員工資料</h2>
            <table class="custom-table">
                <tr>
                    <td>員工姓名：</td>
                    <td><input type="text" id="name"></td>
                </tr>
                <tr>
                    <td>密碼：</td>
                    <td><input type="password" id="password"></td>
                </tr>
                <tr>
                    <td>入職日期：</td>
                    <td><input type="date" id="JoinDate"></td>
                </tr>
                <tr>
                    <td>住址：</td>
                    <td><input type="text" id="address"></td>
                </tr>
                <tr>
                    <td>Email：</td>
                    <td><input type="text" id="email"></td>
                </tr>
                <tr>
                    <td>電話：</td>
                    <td><input type="text" id="phone"></td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center;">
                        <button id="backToList" class="custom-btn secondary-btn">返回列表</button>
                        <button id="doInsert" class="custom-btn">新增</button>
                    </td>
                </tr>
            </table>    
        </div>
    `;
    document.getElementById("content").innerHTML = str;
    document.getElementById("doInsert").onclick = function(){
        doInsert();
    };
    document.getElementById("backToList").onclick = function(){
        const event = new Event('click');
        document.getElementById('employee').dispatchEvent(event);
    };
}
