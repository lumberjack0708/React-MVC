import doRoleInsert from './doRoleInsert.js';

export default function showRoleInsertPage(){
    let str = `
        <h2>新增角色資料</h2>
        <table class="custom-table">
            <tr>
                <td>角色名稱：</td>
                <td><input type="text" id="role_name"></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                    <button id="backToList" class="custom-btn secondary-btn">返回列表</button>
                    <button id="doInsert" class="custom-btn">新增</button>
                </td>
            </tr>
        </table>
    `;
    document.getElementById("content").innerHTML = str;
    document.getElementById("doInsert").onclick = function(){
        doRoleInsert();
    };
    document.getElementById("backToList").onclick = function(){
        const event = new Event('click');
        document.getElementById('role').dispatchEvent(event);
    };
}