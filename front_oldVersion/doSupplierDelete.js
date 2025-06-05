import { getApiUrl } from "./config.js";

export default function doSupplierDelete(sid){
    if(confirm("確定要刪除這個供應商嗎？")) {
        let data = {
            "sid": sid,
        };
        axios.post(getApiUrl("removeSupplier"), Qs.stringify(data))
        .then(res => {
            let response = res['data'];
            document.getElementById("content").innerHTML = response['message'];
            // 成功後延遲1秒重新載入供應商列表
            if(response['status'] === 200) {
                setTimeout(() => {
                    const event = new Event('click');
                    document.getElementById('supplier').dispatchEvent(event);
                }, 1000);
            }
        })
        .catch(err => {
            document.getElementById("content").innerHTML = err;
        });
    }
}