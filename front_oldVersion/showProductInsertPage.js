import doProductInsert from './doProductInsert.js';

export default function showProductInsertPage(){
    let str = `
        <h2>新增產品資料</h2>
        <table class="custom-table">
            <tr>
                <td>產品名稱：</td>
                <td><input type="text" id="p_name"></td>
            </tr>
            <tr>
                <td>成本：</td>
                <td><input type="number" id="cost"></td>
            </tr>
            <tr>
                <td>售價：</td>
                <td><input type="number" id="price"></td>
            </tr>
            <tr>
                <td>庫存數量：</td>
                <td><input type="number" id="stock"></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                    <button id="backToList" class="custom-btn secondary-btn">返回列表</button>
                    <button id="doinsert" class="custom-btn">新增</button>
                </td>
            </tr>
        </table>
    `;
    document.getElementById("content").innerHTML = str;
    document.getElementById("doinsert").onclick = function(){
        doProductInsert();
    };
}