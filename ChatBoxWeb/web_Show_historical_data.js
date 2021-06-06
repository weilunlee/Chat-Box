var ox_con=document.getElementById("OX_container");
var msg_json_arr=new Array();
var interaction=document.getElementById("interaction");


function PrintOnScreem(msg){
    // msg_json_arr=new Array();
    // console.log("received msg")
    // if(msg==""){
    //     console.log("no history")
    // }else{     
    //     msg=msg.split("/%split_here%/");
    //     var i=0;
    //     console.log(msg);
    //     // 處理回應陣列的空值
    //     msg=msg.filter(inutile=>{
    //         return inutile && inutile.trim() && (inutile!="undefined");
    //     })

        // console.log(msg);
        for(var k=0; k<msg.length;k++){
            msg_json_arr[k]=JSON.parse(msg[k]);
            // console.log(msg_json_arr[k]);
        }

        // 處理prefix
        if(msg_json_arr[0].prefix=="login"){
            console.log("recevied login");
            // console.log(msg_json_arr);
            interaction.scrollTo(0, (his_msg_blk()-100));
            sending_blk_show();
        }else{
            console.log("recevied message");
            interaction.scrollTo(0, his_msg_blk()-100);
            new_message_blk.remove();
            interaction.style.height="494px";
        }
        msg_json_arr=new Array();
    }
// }

function msgRecevieFromServer(msg){
    console.log(msg);

    msg=msg.split("/%split_here%/");
    for(var k=0; k<msg.length;k++){
        msg_json_arr[k]=JSON.parse(msg[k]);
        // console.log(msg_json_arr[k]);
    }
    if(msg_json_arr[0].prefix=="sending_signal"){
        console.log("recevied sending_signal");
        interaction.scrollTo(0, (msg_blk(msg)-70));
        sending_blk_show();
    }else{
        console.log("recevied message");
        interaction.scrollTo(0, msg_blk(msg)-70);
        new_message_blk.remove();
        interaction.style.height="494px";
        if(msg_json_arr[0].message=="好的"){
            gaming();           
        }
    }
    msg_json_arr=new Array();
}


// 處理每筆傳入資料
function msg_blk(msg){
    // console.log(msg);
    for(var i=0;i<msg.length; i++){
        var temp_JSON="";
//判斷子判斷
        temp_JSON=JSON.parse(msg[i]);
        
        if(msg_json_arr[i].prefix=="msg"){
            if(temp_JSON.id=="bot"){
                // console.log("b");
                block_assign(temp_JSON.id, temp_JSON.message);
            }else if(temp_JSON.id!="bot"){
                // console.log("u");
                block_assign(temp_JSON.id, temp_JSON.message);
            }
        }
//設高度
        var x=interaction.scrollHeight;
        // console.log(x);
    }
    return x;
}



// 處理歷史資料
function his_msg_blk(){
    for(var i=0;i<msg_json_arr.length; i++){
        // prefix 判斷
        // console.log(msg_json_arr[i]);
        if(msg_json_arr[i].prefix=="msg"){ 
            if(msg_json_arr[i].id=="bot"){
                block_assign(msg_json_arr[i].id, msg_json_arr[i].message);
            }else if(msg_json_arr[i].id!="bot"){
                block_assign(msg_json_arr[i].id, msg_json_arr[i].message);
            }
        }

        //設高度
        var x=interaction.scrollHeight;
        // console.log(x);
    }
    return x;
}


//丟給不同方塊
function block_assign(who, msg_str){
    var my_message=document.createElement("div");
    if(who=="bot"){
        my_message.className="msg_blk bot_blk";                      
    }else if(who!="bot"){
        my_message.className="msg_blk user_blk";                      
    }
    // setTimeout(function(){ console.log(1) }, 5000);
    my_message.innerHTML=" "+msg_str+" ";
    interaction.appendChild(my_message);    
    interaction.innerHTML+="<br>";
}

// function gaming(){
//     for(var i=0;i<all_blocks.length;i++){
//         all_blocks[i].style.visibility="visible";
//     }
//     OOXX();
// }