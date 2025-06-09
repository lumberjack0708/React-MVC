export default function Request(){
    let jwtToken = window.localStorage.getItem("jwtToken");
    if(!jwtToken){
         jwtToken = "111";
    }
    const req = axios.create({
        baseURL: 'http://localhost/MvcPractice/backend/pubic',
        headers: { 'Auth': jwtToken}
    })
    return req;
}
