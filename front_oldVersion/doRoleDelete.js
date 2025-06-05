import { getApiUrl } from "./config.js";

export default function doRoleDelete(role_id){
    if(confirm("確定要刪除這個角色嗎？")) {
        let data = {
            "role_id": role_id,
        };
        axios.post(getApiUrl("removeRole"), Qs.stringify(data))
        .then(res => {
            let response = res['data'];
            document.getElementById("content").innerHTML = response['message'];
            // 成功後延遲1秒重新載入角色列表
            if(response['status'] === 200) {
                setTimeout(() => {
                    const event = new Event('click');
                    document.getElementById('role').dispatchEvent(event);
                }, 1000);
            }
        })
        .catch(err => {
            document.getElementById("content").innerHTML = err;
        });
    }
}