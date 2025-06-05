import { getApiUrl } from "./config.js";

export default function doSelect(){
    axios.get(getApiUrl("getUsers"))
    .then(res => {
        let response = res['data'];
        switch(response['status']){
            case 200:
                const rows = response['result'];
                // 使用外部的 CSS 檔案來美化表格
                let str = '<table class="custom-table">';
                // 表頭
                str += '<thead><tr>';
                str += '<th>編號</th>';
                str += '<th>員工號碼</th>';
                str += '<th>密碼</th>';
                str += '<th>email</th>';
                str += '<th>電話</th>';
                str += '</tr></thead>';
                // 表身
                str += '<tbody>';
                rows.forEach(element => {
                    str += "<tr>";
                    str += "<td>" + element['id'] + "</td>";
                    str += "<td>" + (element['driver_id'] || '') + "</td>";
                    str += "<td>" + element['password'] + "</td>";
                    str += "<td>" + element['email'] + "</td>";
                    str += "<td>" + element['phone'] + "</td>";
                    str += "</tr>";
                });
                str += '</tbody></table>';
                document.getElementById("content").innerHTML = str;
                break;
            default:
                document.getElementById("content").innerHTML = response['message'];
                break;
        }
    })
    .catch(err => {
        document.getElementById("content").innerHTML = err;
    })
}
