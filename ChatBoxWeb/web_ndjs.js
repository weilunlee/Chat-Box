const address='ws://localhost:3000/'
const wsWeb=new WebSocket(address);

var login_btn=document.getElementById("login_btn");


var user={
    prefix:"",
    id:"user",
    emot:10,
    msg:"",
    // historyData:historyDataArr,    
}

// messageRecieved();

//websocket 開啟連接!!!
function openConnection(userID) {
    wsWeb.onopen;                                       //開啟連接
    console.log("Connection is opened");
    init(userID);                                       //初始化client JSON    
    wsWeb.send(JSON.stringify(user));
}

//websocket 接收訊息!!!
// function messageRecieved(){
    wsWeb.onmessage=function(e){
        // console.log(e);
        // console.log("recevied"+e.data);
        var recevied_msg=StrtoArray(e.data);
        PrintOnScreem(recevied_msg);        
        // console.log(recevied_msg);    
    };
// }

//websocket 傳送訊息!!!
function sendMessage(e){
    console.log("sent!!")
    user.msg=e;
    user.prefix="msg";
    console.log(user);
    str_sent=JSON.stringify(user);
    wsWeb.send(str_sent);
}

//websocket 關閉連線!!!
function autoCloseConnection(){
    wsWeb.close();
    console.log("close connection");
}

//初始化 user物件
function init(id){
    user.id=id;
    user.prefix="login";
}

//處理JSON & 切割字串
function StrtoArray(str){
    var JSON_array=str.split("/%split_here%/");
    console.log(JSON_array);
    JSON_array=JSON_array.filter(string=>{
        return string && string.trim() && (string!="undefined");
    });
    return JSON_array;
}

