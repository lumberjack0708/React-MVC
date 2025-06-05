import employeeInfo from './employeeInfo.js';
import { getApiUrl } from './config.js';

export default function doUpdate(){
    // 獲取所有欄位值
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const JoinDate = document.getElementById("JoinDate").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    
    // 驗證必填欄位
    if (!id || !password) {
        alert("請填寫必要欄位");
        return;
    }
    
    // 組合資料，移除 driver 欄位
    let data = {
        "id": id,
        "name": name,
        "password": password,
        "JoinDate": JoinDate,
        "address": address, // 添加 address 欄位
        "email": email,
        "phone": phone
    };
    
    // 發送請求
    axios.post(getApiUrl("updateUser"), Qs.stringify(data))
    .then(res => {
        let response = res['data'];
        switch(response['status']){
            case 200:
                alert("更新成功");
                employeeInfo(); // 重新載入員工列表
                break;
            default:
                alert(response['message']);
                break;
        }
    })
    .catch(err => {
        alert("系統錯誤:" + err);
    })
}