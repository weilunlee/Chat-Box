var container=document.getElementById("container");
var outer_inter_blk=document.getElementById("outer_inter_blk");
var userID_Dom=document.getElementById("userID");
var login=document.getElementById('login');
var login_btn=document.getElementById("login_btn");
// var user_arr=[false,""];
var start_bl=false;                                         //聊天室開關布林
var start_btn=document.getElementById("start_btn");
var _type=document.getElementById("type");
var inp_txt=document.getElementById("inp_txt");
var tri=document.getElementById("tri");
var interaction=document.getElementById("interaction");
var new_message=document.createElement("div");
var new_message_blk=document.createElement("div");
var _body=document.querySelector("body");



userID_Dom.addEventListener("keypress",e=>{
    if(e.key==="Enter" && e.isComposing==false){
        login_btn.click();
    }
});

tri.addEventListener("click", function(){
    var _inp=document.getElementById("inp_txt").value;   
    sendMessage(_inp);
    // console.log(_inp);
    // inp_show.innerHTML=inp;
    // user_arr[0]=true;
    // user_arr[1]=_inp;
    // if(inp_txt.value !=""){
        // init(user_arr);
    // }
},false);


// 增加輸入中符號
// inp_txt.addEventListener('focus',sending_blk_show);

function sending_blk_show(){
    new_message_blk.className="sending_msg_blk";
    new_message.className="sending_msg";
    container.insertBefore(new_message_blk,_type);
    new_message_blk.appendChild(new_message);
    interaction.style.height="429px";
}

// enter推送
inp_txt.addEventListener('keydown', e=>{
    // console.log(e);
    if(e.key==="Enter"&& inp_txt.value !=""){
        tri.click();
        inp_txt.value="";
    }
});

// 移除輸入中符號
inp_txt.addEventListener('blur',function(){
    // new_message_blk.remove();
    // interaction.style.height="494px";
});

function focus_inp(){
    userID_Dom.focus();
}


function start(){
    let userID=userID_Dom.value;
    if(start_bl==false){
        // console.log("start");
        container.style.opacity=100;
        container.style.height="100%";
        container.style.width="100%";
        _type.style.opacity=100;
        container.addEventListener("transitionend", function(){
            tri.style.display="inline";
        });
        start_bl=true;
    }else{
        console.log("end");
        container.style.opacity=0;
        container.style.height="0%";
        container.style.width="0%";
        _type.style.opacity=0;        
        container.addEventListener("transitionend", function(){
            tri.style.display="none";
        });
        start_bl=false;
    }
    inp_txt.focus();    
    openConnection(userID);
    login.style.display="none";
}