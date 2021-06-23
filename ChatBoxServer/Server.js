// const express=require("express");                        先不用 express 看看
// const server=express().listen(PORT, function(){ console.log('listening on PORT: '+PORT); })

const WebSocket=require('ws');                              //取得ws
const fs=require('fs');                                  //取得fs(放在物件裡面)
// const bodyParser = require('body-parser');
const wss=new WebSocket.Server({ port:3000, });             //其實裡面應該是JSON個格式的物件
wss.on('listening', ()=>{ console.log('listening on PORT: 3000') });   //讓server持續監聽 port 3000

// historyData存成陣列
var historyDataArr=new Array();


// 建立機器人JSON物件
var bot={
    prefix:"",
    id:"bot",
    emot:10,
    msg:"",
    historyData:historyDataArr,    
}

// 建立client JSON物件
var client={
    prefix:"",
    id:"client",
    emot:10,
    msg:"",
    historyData:historyDataArr,    
}

class createBot {
    tempSavingData="";
    string_identifer="/%split_here%/";
    cleaned_Msg="";
    constructor(e_str) {
        var _JSON=JSON.parse(e_str);
        this.id = _JSON.id;
        this.msg = _JSON.msg;
        this.prefix = _JSON.prefix;
        this.emot = _JSON.emot;
        this.historyData = historyDataArr;
        this.fileName=_JSON.id+"HistoricalData.txt";
    }

    //外接函數
    historyFile(){                                     //找or創立client資料
        var temp="";
        this.openNewFile(this.fileName);
        temp=this.readingFile(this.fileName).toString("utf-8");
        historyDataArr=this.StrtoArray(temp)    
        this.historyData=historyDataArr;
        return historyDataArr;
    }



    inputMsg(strMsg){                                    //輸入對話
        this.savingMsgToFile(this.fileName, strMsg);     //輸入存檔
        this.msg=this.msg;                                 //原始輸入
        this.cleaned_Msg=this.inputTextCleaning(this.msg); //清理後輸入       
    }

    replyProcessing(){                                      //生成回應+存入JSON
        bot.id="bot";
        bot.msg=this.msg;
        bot.prefix=this.prefix;
        bot.emot=this.emot;
        bot.historyData=this.historyData;
        bot.fileName=this.fileName;
        console.log("處理完的回應 bot object: ")
        console.log(bot)
        if(bot.prefix=="login"){
            return this.historyData.join(this.string_identifer);

        }else if(bot.prefix=="msg"){
            var s=new Array();
            s[0]=JSON.stringify(bot);
            return s.join(this.string_identifer);
        }
    }



    // 內部函數庫
    // 讀檔用
    openNewFile(fileName){                                  //開新檔
        fs.open(fileName, 'a+', function(err, fd){
            if(err) throw "開檔失敗";
        });      
    }
    readingFile(fileName){                                  //讀舊檔
        console.log(fileName);
        return (fs.readFileSync(fileName))        
    }

    StrtoArray(str){                                        //str 轉 JSON array
        var JSON_array=str.split("/%split_here%/");
        JSON_array=JSON_array.filter(string=>{
            return string && string.trim() && (string!="undefined");
        })
        return JSON_array;
    }
    
    
    savingMsgToFile(fileName, msg){
        this.tempSavingData+=(msg+this.string_identifer);
        fs.appendFile(fileName, this.tempSavingData, (err)=>{
            if(err) throw "append file wrong & err="+err;
            this.tempSavingData="";
        });
        this.tempSavingData="";
    }




    // 處理輸入用
    inputTextCleaning(msg){
        console.log("to lower case wrong 之 string(should be message content)" + msg)
        var lower_case_str=msg.toLowerCase();    //  變小寫
        // 去標點符號
        var arr_punc=['。','！','!', '"', '#', '$', '%', '&', '\'', '(', ')', '*',
            '+', ', ', '-', '.', '/', ':', ';', '<', '=', '>',    
            '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|',    
            '}', '~', '；', '﹔', '︰', '﹕', '：', '，', '﹐', '、',    
            '．', '﹒', '˙', '·', '。', '？', '！', '～', '‥', '‧',    
            '′', '〃', '〝', '〞', '‵', '‘', '’', '『', '』', '「',    
            '」', '“', '”', '…', '❞', '❝', '﹁', '﹂', '﹃', '﹄'];

        let str1="["+arr_punc.join('')+"]";
        lower_case_str=lower_case_str.replace(new RegExp(str1,'g'),'');

        // lower_case_str=lower_case_str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

        let arr_aha=["啊","阿","哇","嗎","嘛","了","呢","欸","哈","啦"];
        // 去語助詞
        let str2="["+arr_aha.join('')+"]";
        lower_case_str=lower_case_str.replace(new RegExp(str2,'g'),'');
        console.log("自動去字" + lower_case_str)
        return lower_case_str;
    }




    emotion_ident(emot){
        if(emot>7){
            return "happy";
        }else if(emot<=7 && emot>4){
            return "normal";
        }else if(emot<=7){
            return "angry";
        }
    
    
    }


    // 語料庫儲存~~~~
    replySummary(){
        let bot_emotion=this.emotion_ident(this.emot);

        var reply_for_nothing_hap=["請問有什麼需要幫忙的嗎?´･ᴗ･`","我能幫你做什麼呢?","今天有什麼事嗎~","嗨~你好啊~(´･ω･`)"];
        var reply_for_nothing_nor=["要幹嘛?","找我做什麼?","今天衝啥?","有事嗎?"];
        var reply_for_nothing_ang=["...","我不想幫你","沒事我走了"];
        var user_greeting_hap=["HI~~","哈囉","你好啊","嗨~你好啊~(´･ω･`)"];
        var user_greeting_nor=["嗨","是你啊","...嗯","來了就來了"];
        var user_greeting_ang=["你還來啊","還敢來?","膽子不小阿"];

        if(bot_emotion=="happy"){
            if(this.cleaned_Msg==0){
                this.msg=user_greeting_hap[Math.round(Math.random()*(user_greeting_hap.length-1))];            
            }
            if(this.cleaned_Msg==1){
                this.msg=reply_for_nothing_hap[Math.round(Math.random()*(reply_for_nothing_hap.length-1))];            
            }
        }else if(bot_emotion=="normal"){
            if(this.cleaned_Msg==0){
                this.msg=user_greeting_nor[Math.round(Math.random()*(user_greeting_nor.length-1))];            
                return;
            }
            if(this.cleaned_Msg==1){
                this.msg=reply_for_nothing_nor[Math.round(Math.random()*(reply_for_nothing_nor.length-1))];            
                return;
            }
        }else if(bot_emotion=="angry"){
            if(this.cleaned_Msg==0){
                this.msg=user_greeting_ang[Math.round(Math.random()*(user_greeting_ang.length-1))];            
                return;
            }
            if(this.cleaned_Msg==1){
                this.msg=reply_for_nothing_ang[Math.round(Math.random()*(reply_for_nothing_ang.length-1))];            
                return;
            }
        }

        var play_or_not="";
        var hi=["hi","hello","你好", "嗨","哈囉","哈摟","哈搂","Good morning","Morning", "Evening", "Good Evening", "你好阿", "早", "早安","你好挖","你好啊","你好哇"];
        var reply_hi=["你好", "嗨","哈囉你好","早","早安"];
        var who_are_you=["你是誰","你誰","你是啥","誰","Who are you", "What are you","你是甚麼","你是什麼"];
        var reply_who_are_you=["...請別問廢話", "關你屁事", "干卿底事?", "我是你爸", "你不會想知道的", "我是好人，也是壞人", "( ಠ_ಠ )", " | •́ ▾ •̀ |", "٩(●˙▿˙●)۶…⋆ฺ", "(•ิ_•ิ)?"];
        var reply_for_win=["恭喜", "哼", "我明明快就要贏的!!!!","再來一次啦","我不玩了","我不玩了","我不玩了","阿不就好棒棒"];
        // console.log("line 205: "+this.msg);
        play_or_not=this.msg.match(/要/);
        let win_or_not=this.msg.match(/我贏/)
        if(play_or_not=="要"){
            this.msg="好的";
        }
    
        if(win_or_not=="我贏"){
            this.emot=this.emot-1;
            for(let i=0;i<hi.length; i++){    
                this.msg=reply_for_win[Math.round(Math.random()*(reply_for_win.length-1))];   
                // return reply_for_win[Math.round(Math.random()*(reply_for_win.length-1))];            
            }        
        }    
        console.log("this msg :+++++++++++++++++++++++++++")
        console.log(this.msg);
    
        for(let i=0;i<hi.length; i++){ 
            if(this.cleaned_Msg==hi[i]){
                this.msg=reply_hi[Math.round(Math.random()*(reply_hi.length-1))];     
            }        
        }
        for(var i=0;i<who_are_you.length; i++){    
            if(this.cleaned_Msg==who_are_you[i]){
                let num=Math.random()*(reply_who_are_you.length-1);
                console.log("line 83:"+num);
                this.msg=reply_who_are_you[Math.round(num)];            
                // return reply_who_are_you[Math.round(num)];            
            }        
        }
        for(var i=0;i<hi.length; i++){    
            if(this.cleaned_Msg==hi[i]){
                this.msg=reply_hi[Math.round(Math.random()*reply_hi.length)];
                // return reply_hi[Math.round(Math.random()*reply_hi.length)];            
            }        
        }



    }
    
}










// ----------------------------------------class分割線-------------------------------------------//









//處理prefix
function onMessageInput(e){
    var json_inp=JSON.parse(e);
    let botClass=new createBot(e);
    let str_out="";
    if(json_inp.prefix=="login"){                   //確認client + reply history data
        // create bot class
        // open file
        // reply history data
        // reply greeting
        var temp_test_arr=botClass.historyFile();
        console.log("history file read successful :");
        console.log(temp_test_arr);
        str_out=botClass.replyProcessing();
        return str_out;
    }else if(json_inp.prefix=="msg"){
        // open file
        // reply history data
        // reply greeting
        botClass.inputMsg(e);
        botClass.replySummary();
        str_out=botClass.replyProcessing();
        botClass.inputMsg(str_out);
        console.log("strOut :"+str_out)
        return str_out;
    
    }else if(json_inp.prefix=="other"){
    
        return json_inp;        
    
    }

} 



// var historyDataArr;




// 最後，開始連線!!!
wss.on('connection', ws=>{                                  //client 節點連線
    console.log("client connection");
    // historyDataArr=bot.historyFile();
    ws.on('message', e=>{                                 //收到訊息
        console.log("input here:"+e);
        let str=onMessageInput(e)
        console.log("回應 send :"+str)
        ws.send(str);
        console.log("======= communication end ==================")
    });
    
    ws.on('close', e=>{

        console.log("client disconnect");
    })

})
