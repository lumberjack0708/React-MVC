export default function Request(){
    const req = axios.create({
        baseURL: 'http://localhost/test/jwt',
        headers: { 'Auth': window.localStorage.getItem("jwtToken")}
    })
    return req;
} 
