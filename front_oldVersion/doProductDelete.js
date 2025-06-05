import { getApiUrl } from "./config.js";

export default function doProductDelete(pid){
    if(confirm("確定要刪除此產品嗎？")) {
        let data = {
            "pid": pid,
        };
        axios.post(getApiUrl("removeProduct"), Qs.stringify(data))
        .then(res => {
            let response = res['data'];
            document.getElementById("content").innerHTML = response['message'];
            // 成功後延遲1秒重新載入產品列表
            if(response['status'] === 200) {
                setTimeout(() => {
                    const event = new Event('click');
                    document.getElementById('product').dispatchEvent(event);
                }, 1000);
            }
        })
        .catch(err => {
            document.getElementById("content").innerHTML = err;
        });
    }
}