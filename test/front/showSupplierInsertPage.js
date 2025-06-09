import doSupplierInsert from './doSupplierInsert.js';

export default function showSupplierInsertPage(){
    let str = `
        <div class="form-container">
            <h2>新增供應商資料</h2>
            <table class="custom-table">
                <tr>
                    <td>供應商名稱：</td>
                    <td><input type="text" id="s_name"></td>
                </tr>
                <tr>
                    <td>聯絡人：</td>
                    <td><input type="text" id="contact"></td>
                </tr>
                <tr>
                    <td>聯絡電話：</td>
                    <td><input type="text" id="tel" maxlength="10"></td>
                </tr>
                <tr>
                    <td>地址：</td>
                    <td><input type="text" id="address"></td>
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
        doSupplierInsert();
    };
    document.getElementById("backToList").onclick = function(){
        const event = new Event('click');
        document.getElementById('supplier').dispatchEvent(event);
    };
}