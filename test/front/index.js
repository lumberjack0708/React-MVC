import Request from './Request.js';
import main from './main.js';
import doLogin from './doLogin.js';


window.onload = function(){
    if(window.localStorage){
        Request().get("/index.php")
        .then(res => {
            const response = res['data'];
            if(response['status'] == 200){
                window.localStorage.setItem("jwtToken", response['token']);
                main();
            }
            else{
                doLogin();
            }
        })
        .catch(err => {
            console.error(err); 
        })
    }
}
