// var Input =document.getElementById("csv_file");

var Input = "";
var Raw_text;

var today = new Date();

// console.log(Current_Year,Current_Month,Current_Date);

class HMS{
    constructor(h,m,s){
        this.H=h;
        this.M=m;
        this.S=s;
    }
}

var Month_study_total=new HMS(0,0,0);
var Week_study_total =new HMS(0,0,0);
var Daily_study_total =new HMS(0,0,0);

class Time{
    constructor(H,M,S,h,m,s,sta){

        this.start=parseInt(H,10)*3600+parseInt(M,10)*60+parseInt(S,10);
        this.end  =parseInt(h,10)*3600+parseInt(m,10)*60+parseInt(s,10);
        this.state=sta;
    }
}

class Total{
    constructor(y){
        this.Year=y;
        this.T=0;
        this.Week_num=new Map;
        this.Month_num=new Map([
            ["1",0],
            ["2",0],
            ["3",0],
            ["4",0],
            ["5",0],
            ["6",0],
            ["7",0],
            ["8",0],
            ["9",0],
            ["10",0],
            ["11",0],
            ["12",0],
        ]);
        this.Day_num=new Map;
    }

    Insert(m,d,time_obj){
        let y = this.Year;
        if(time_obj.state=="0") return;

        let wk = YearWeek(y,m,d);
        let temp_w = this.Week_num.get(wk);
        if(temp_w==undefined ){
            this.Week_num.set(wk,0);
        }
        let md=String(m).padStart(2,'0')+String(d).padStart(2,'0');
        let temp_d= this.Day_num.get(md);
        if(temp_d==undefined){
            this.Day_num.set(md,0);
        }

        let tt=time_obj.end - time_obj.start;
        this.T+=tt;
        let MM= this.Month_num.get(m);
        let WW= this.Week_num.get(wk);
        let DD= this.Day_num.get(md);
        MM+=tt;
        WW+=tt;
        DD+=tt;
        this.Month_num.set(m,MM);
        this.Week_num.set(wk,WW);
        this.Day_num.set(md,DD);
    }

    Has_week(m,d){
        let wk = YearWeek(this.Year,m,d);
        return this.Week_num.has(wk);
    }

    Get_week_Total(m,d){
        let wk = YearWeek(this.Year,m,d);
        return this.Week_num.get(wk);
    }

    Get_Month_Total(m){
        return this.Month_num.get(m);
    }

    Get_Day_Total(m,d){
        let md=String(m).padStart(2,'0')+String(d).padStart(2,'0');
        return this.Day_num.get(md);
    }

}

class __DATA__{
    constructor(){
        this.Year=new Map;
        this.Year_Total=new Map;
    }

    Has_Year(y){
        return this.Year.get(y)==undefined ? false:true;
    }

    Has_week(y,m,d){
        if(this.Year.get(y)==undefined ) return false;
        return this.Year_Total.get(y).Has_week(m,d);
    }

    Has_Month(y,m){
        let temp_y=this.Year.get(y)
        if(temp_y==undefined) return false;
        let temp_m= temp_y.get(m);
        if(temp_m==undefined) return false;

        return true;
    }

    Has_Date(y,m,d){
        let temp_y=this.Year.get(y)
        if(temp_y==undefined) return false;
        let temp_m= temp_y.get(m);
        if(temp_m==undefined) return false;
        let temp_d= temp_m.get(d);
        if(temp_d==undefined) return false;

        return true;
    }

    Get_Total(y){this.Year.get(y)==undefined
        return this.Year_Total.get(y);
    }

    Get_Day_HMS(y,m,d){
        let TT= this.Year_Total.get(y).Get_Day_Total(m,d);
        let H=parseInt(TT/3600,10);
        let M=parseInt((TT-H*3600)/60,10);
        let S=parseInt((TT-H*3600)%60,10);
        Daily_study_total.H=H;
        Daily_study_total.M=M;
        Daily_study_total.S=S;
    }

    Get_Week_HMS(y,m,d){
        let TT= this.Year_Total.get(y).Get_week_Total(m,d);
        
        console.log("fun:Get_W_HMS",TT);
        
        let H=parseInt(TT/3600,10);
        let M=parseInt((TT-H*3600)/60,10);
        let S=parseInt((TT-H*3600)%60,10);
        Week_study_total.H=H;
        Week_study_total.M=M;
        Week_study_total.S=S;
    }

    Get_Month_HMS(y,m){
        let TT= this.Year_Total.get(y).Get_Month_Total(m);
        let H=parseInt(TT/3600,10);
        let M=parseInt((TT-H*3600)/60,10);
        let S=parseInt((TT-H*3600)%60,10);
        Month_study_total.H=H;
        Month_study_total.M=M;
        Month_study_total.S=S;
    }

    Get_Year(y){ return this.Year.get(y); };

    Get_Month(y,m){
        return this.Year.get(y).get(m);
    }

    Get_Day(y,m,d){
        return this.Year.get(y).get(m).get(d);
    }

    Insert(y,m,d,time_obj){
        if( !this.Has_Year(y)){
            this.Year.set(y,new Map());
            this.Year_Total.set(y,new Total(y) );

        }
        
        if( !this.Has_Month(y,m)){
            this.Get_Year(y).set(m,new Map());
        }
        if( !this.Has_Date(y,m,d)){
            this.Get_Month(y,m).set(d,new Array);
        }

        this.Get_Day(y,m,d).push(time_obj);
        
        this.Get_Total(y).Insert(m,d,time_obj);

    }
}


function Monthweek(y, m) {
    y=parseInt("20"+y,10);
    m=parseInt(m,10);
    // month_number is in the range 1..12

    let firstOfMonth = new Date(year, month_number-1, 1);
    let lastOfMonth = new Date(year, month_number, 0);

    let used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();

    return Math.ceil( used / 7);
}

function YearWeek(y,m,d){
    let cur = new Date(parseInt("20"+y,10),parseInt(m,10),parseInt(d,10) );
    let init= new Date(parseInt("20"+y,10),0,1);
    let numofdays = Math.floor((cur-init)/ (24 * 60 * 60 * 1000) );              
    let result = Math.ceil( (cur.getDay()+1+numofdays) /7)

    return result;   
}


var DATA=new __DATA__;

/*
function Read_file(){
    const Csv = Input.files[0];
    console.log("in");
    const reader = new FileReader();

    reader.onload = function (e) {
        Raw_text = e.target.result;
        console.log(Raw_text);

        csvToArray(Raw_text);
        console.log("out");
    };

    const Csv=Input;
    // reader.readAsText(Csv);
    csvToArray(Csv);
    console.log("done");
}
*/


function csvToArray(str, delimiter = ",") {
    // str=str.text();
    console.log("CSVtoArr\n",str);

    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
    
    // return arr;
    console.log(arr);

    const len=arr.length-1;


    for(let i=0 ; i< len ;i+=2){
        let y= arr[i].year;
        let m= arr[i].month;
        let d= arr[i].date;
        let state=arr[i].state;

        let h1=arr[ i ].hour,m1=arr[ i ].minute,s1=arr[ i ].second;
        let h2=arr[i+1].hour,m2=arr[i+1].minute,s2=arr[i+1].second;

        DATA.Insert(y,m,d,new Time(h1,m1,s1,h2,m2,s2,state) );
    }
    console.log( arr[0]);
    console.log( DATA);
    

    Reload();
}
/*

var Orig_Desktop= document.querySelector(".Laptop");
var Login_Page= document.querySelector(".Computer_Login");
Orig_Desktop.style.transition= "2s";
Orig_Desktop.style.zIndex = "1"
Orig_Desktop.style.transform= "scale(1)";
Login_Page.style.visibility="hidden";

*/

function Show_Alert(){
    let obj = document.querySelector(".Alert");
    obj.style.width="500px";
    obj.style.setProperty("--Font_size","55px");
    
    setTimeout(function(){obj.style.width="0px";obj.style.setProperty("--Font_size","0px");},2000);
}

function comp(a,b){
    return a.start < b.start ;
}

var TTT=43200;
var style_text_day="";
var style_text_night="";

var Night=false;

function Change_Btn(){
    let obj =document.querySelector(".AMPM");
    if(Night){
        obj.style.setProperty("--BG","transparent");
        obj.style.setProperty("--Text_Col","#fff");
        obj.style.setProperty("--BOX_sha","inset 0 0 0 5px #fff");
        obj.style.setProperty("--Hover_Text_Col","#000");
        obj.style.setProperty("--Bor_Col","#000");

        return;
    }

    obj.style.setProperty("--BG","#000");
    obj.style.setProperty("--Text_Col","#fff");
    obj.style.setProperty("--BOX_sha","inset 0 0 0 5px #fff");
    obj.style.setProperty("--Hover_Text_Col","red");
    obj.style.setProperty("--Bor_Col","red");
}

function Change_View(){

    Change_Btn();
    if(Night){
        Night=false;
        let clock=document.querySelector(".Record");
        console.log(style_text_night);
        clock.style.background="conic-gradient("+style_text_night+")";
    
        let btn=document.querySelector(".AMPM");
        btn.innerHTML="Night";

        let obj=document.querySelector(".SVG");
        obj.style.filter="invert(0%)";

        obj =document.querySelector(".H");
        obj.style.background="#000";

        obj =document.querySelector(".M");
        obj.style.background="#000";

        obj =document.querySelector(".Mid");
        obj.style.background="#fff";
        obj.style.border="solid #000 5px";

        //body
        obj=document.querySelector("body");
        obj.style.background="rgb(121, 114, 114)";
        return;
    }
    

    Night=true;
    let clock=document.querySelector(".Record");
    console.log(style_text_day);
    clock.style.background="conic-gradient("+style_text_day+")";
    
    let btn=document.querySelector(".AMPM");
    btn.innerHTML="Day";

    let obj=document.querySelector(".SVG");
    obj.style.filter="invert(100%)";

    obj =document.querySelector(".H");
    obj.style.background="#fff";

    obj =document.querySelector(".M");
    obj.style.background="#fff";

    obj =document.querySelector(".Mid");
    obj.style.background="#000";
    obj.style.border="solid #fff 5px";

    //body
    obj=document.querySelector("body");
    obj.style.background="#000";
    
}

function Init_View(){
    Night=false;
    let btn=document.querySelector(".AMPM");
    btn.innerHTML="Night";

    let obj=document.querySelector(".SVG");
    obj.style.filter="invert(0%)";

    obj =document.querySelector(".H");
    obj.style.background="#000";

    obj =document.querySelector(".M");
    obj.style.background="#000";
    obj =document.querySelector(".Mid");
    obj.style.background="#fff";
    obj.style.border="solid #000 5px";


    // btn
    obj =document.querySelector(".AMPM");
    obj.style.setProperty("--BG","transparent");
    obj.style.setProperty("--Text_Col","#fff");
    obj.style.setProperty("--BOX_sha","inset 0 0 0 5px #fff");
    obj.style.setProperty("--Hover_Text_Col","#000");
    obj.style.setProperty("--Bor_Col","#000");

    //body
    obj=document.querySelector("body");
    obj.style.background="rgb(121, 114, 114)";
}

function Reload(){

    Init_View();

    let YY = YYYY.substr(2,3);
    let have_data = DATA.Has_Date(YY,MMMM,DDDD);
    console.log(YY,MMMM,DDDD);

    if( !have_data ){
        Show_Alert();
        console.log("NO Data");


        let clock=document.querySelector(".Record");
        clock.style.background="rgba(255, 255, 255, 0)";
        style_text_night="";
        style_text_day="";

        let show_m=document.querySelector("#Show_TM");
        let show_w=document.querySelector("#Show_TW");
        let show_d=document.querySelector("#Show_TD");

        if(DATA.Has_Month(YY,MMMM) ){
            DATA.Get_Month_HMS(YY,MMMM);
            let m_text = String(Month_study_total.H).padStart(3,'0')+":"+String(Month_study_total.M).padStart(2,'0')+":"+String(Month_study_total.S).padStart(2,'0');
            show_m.innerHTML=m_text;
        }
        else show_m.innerHTML="000:00:00";

        console.log("YearWeek :",YearWeek(YY,MMMM,DDDD));

        if(DATA.Has_week(YY,MMMM,DDDD) ){
            DATA.Get_Total(YY).Get_Week_HMS

            let w_text = String(Week_study_total.H).padStart(2,'0')+":"+String(Week_study_total.M).padStart(2,'0')+":"+String(Week_study_total.S).padStart(2,'0');
            show_w.innerHTML=w_text;
        }
        else show_w.innerHTML="00:00:00";
        
        show_d.innerHTML="00:00:00";
        
        return ;
    }

    console.log("Have Data");



    let que=DATA.Get_Day(YY,MMMM,DDDD);
    que.sort(comp);


    
    let Last_deg=0;
    style_text_day="rgba(255, 255, 255, 0) "+String( Last_deg )+"deg,\n";
    style_text_night="rgba(255, 255, 255, 0) "+String( Last_deg )+"deg,\n";
    let id=0,len=que.length;
    let st=0,ed=0;

    for(;id<len;id++){
        
        // console.log(que[id].start,que[id].end);

        if(que[id].start >= TTT){
            style_text_day+="rgba(255, 255, 255, 0) "+String(Last_deg)+"deg";
            Last_deg=0;
            
            break;
        }
        if(que[id].end > TTT){
            st=que[id].start*360/TTT; // double 
            st=parseInt(st ,10); // int
            
            if(que[id].state=="1"){
                style_text_day+="rgba(255, 255, 255, 0) "+String( Last_deg)+"deg "+String( st )+"deg,\n";
                style_text_day+="rgb(0, 247, 255) "+String( st )+"deg "+String( 360 )+"deg\n";
            }
            else{
                style_text_day+="rgba(255, 255, 255, 0) "+String( Last_deg)+"deg "+String( st )+"deg,\n";
                style_text_day+="rgb(187, 255, 0) "+String( st )+"deg "+String( 360 )+"deg\n";
            }

            ed=parseInt( (que[id].end-TTT)*360/TTT,10);

            if(que[id].state=="1"){
                style_text_night+="rgb(0, 247, 255) "+String( 0)+"deg "+String( ed )+"deg,\n";
            }
            else{
                style_text_night+="rgb(187, 255, 0) "+String( 0)+"deg "+String( ed )+"deg,\n";
            }
            Last_deg=ed;
            id++;
            break;
        }

        st=que[id].start*360/TTT; // double 
        st=parseInt(st,10); // int
        ed=que[id].end*360/TTT;
        ed=parseInt(ed,10);

        if(que[id].state=="1"){
            style_text_day+="rgba(255, 255, 255, 0) "+String( Last_deg)+"deg "+String( st )+"deg,\n";
            style_text_day+="rgb(0, 247, 255) "+String( st )+"deg "+String( ed )+"deg,\n";
            
        }
        else{
            style_text_day+="rgba(255, 255, 255, 0) "+String( Last_deg)+"deg "+String( st )+"deg,\n";
            style_text_day+="rgb(187, 255, 0) "+String( st )+"deg "+String( ed )+"deg,\n";
            
        }

        Last_deg=ed ;
    }

    for(;id<len;id++){

        // console.log(que[id].start,que[id].end,que[id].start-TTT,que[id].end-TTT);

        st= que[id].start-TTT;
        ed= que[id].end-TTT;

        st=st*360/TTT; // double 
        st=parseInt(st,10); // int
        ed=ed*360/TTT;
        ed=parseInt(ed,10);

        // console.log(st,ed,que[id].state);


        if(que[id].state=="1"){
            style_text_night+="rgba(255, 255, 255, 0) "+String( Last_deg)+"deg "+String( st )+"deg,\n";
            style_text_night+="rgb(0, 247, 255) "+String( st )+"deg "+String( ed )+"deg,\n";
            
        }
        else{
            style_text_night+="rgba(255, 255, 255, 0) "+String( Last_deg)+"deg "+String( st )+"deg,\n";
            style_text_night+="rgb(187, 255, 0) "+String( st )+"deg "+String( ed )+"deg,\n";
            
        }
        Last_deg=ed ;
    }
    
    style_text_night+="rgba(255, 255, 255, 0) "+String(Last_deg)+"deg";

    let clock=document.querySelector(".Record");
    clock.style.background="conic-gradient("+style_text_night+")";
    // clock.style.background ="conic-gradient(black,rgb(0, 247, 255))";
    
    // clock.style.transition= "1s";
    
    // console.log(style_text_day,"\n-------\n",style_text_night);


    // -----show monthly & weekly total 
    DATA.Get_Month_HMS(YY,MMMM);
    DATA.Get_Week_HMS( YY,MMMM,DDDD);
    DATA.Get_Day_HMS( YY,MMMM,DDDD);

    let show_m=document.querySelector("#Show_TM");
    let show_w=document.querySelector("#Show_TW");
    let show_d=document.querySelector("#Show_TD");

    let m_text = String(Month_study_total.H).padStart(3,'0')+":"+String(Month_study_total.M).padStart(2,'0')+":"+String(Month_study_total.S).padStart(2,'0');
    let w_text = String(Week_study_total.H).padStart(2,'0')+":"+String(Week_study_total.M).padStart(2,'0')+":"+String(Week_study_total.S).padStart(2,'0');
    let d_text = String(Daily_study_total.H).padStart(2,'0')+":"+String(Daily_study_total.M).padStart(2,'0')+":"+String(Daily_study_total.S).padStart(2,'0');

    show_m.innerHTML=m_text;
    show_w.innerHTML=w_text;
    show_d.innerHTML=d_text;

}

var Y_index=today.getFullYear()-2000;
var M_index=today.getMonth();
var D_index=today.getDate()-1;

var YYYY=String(today.getFullYear());
var MMMM=String(today.getMonth()+1);
var DDDD=String(today.getDate());

function Init_Option(){
    let obj=document.querySelector("#Sel_Y");
    let temp;
    for(let i=0;i<10;i++){
        temp="200"+String(i);
        obj.add(new Option(temp,temp));
    }
    for(let i=10;i<100;i++){
        temp="20"+String(i);
        obj.add(new Option(temp,temp));
    }
    
    obj = document.getElementById("Sel_Y");
    obj.selectedIndex=Y_index;

    obj = document.getElementById("Sel_M");
    obj.selectedIndex=M_index;

    obj = document.getElementById("Sel_D");
    obj.selectedIndex=D_index;
}


function Y_min(){
    let obj = document.getElementById("Sel_Y");
    let cur_y_id = obj.selectedIndex;
    console.log(cur_y_id);
    if(cur_y_id-1 < 0){

        return;
    }
    Y_index-=1;
    obj.selectedIndex-=1;

    if(Y_index<10) YYYY="200"+String(Y_index);
    else YYYY="20"+String(Y_index);

    Reload();
}
function Y_add(){
    let obj = document.getElementById("Sel_Y");
    let cur_y_id = obj.selectedIndex;
    console.log(cur_y_id);
    if(cur_y_id+1 > 99){

        return;
    }
    Y_index+=1;
    obj.selectedIndex+=1;

    if(Y_index<10) YYYY="200"+String(Y_index);
    else YYYY="20"+String(Y_index);

    Reload();
}
function M_min(){
    let obj = document.getElementById("Sel_M");
    let cur_m_id = obj.selectedIndex;
    console.log(cur_m_id);
    if(cur_m_id-1 < 0){

        return;
    }
    M_index-=1;
    obj.selectedIndex-=1;

    MMMM= String(M_index+1);

    Reload();
}
function M_add(){
    let obj = document.getElementById("Sel_M");
    let cur_m_id = obj.selectedIndex;
    console.log(cur_m_id);
    if(cur_m_id+1 > 11 ){

        return;
    }
    M_index+=1;
    obj.selectedIndex+=1;

    MMMM= String(M_index+1);
    Reload();
}
function D_min(){
    let obj = document.getElementById("Sel_D");
    let cur_d_id = obj.selectedIndex;
    console.log(cur_d_id);
    if(cur_d_id-1 < 0){

        return;
    }
    D_index-=1;
    obj.selectedIndex-=1;

    DDDD= String(D_index+1);
    Reload();
}
function D_add(){
    let obj = document.getElementById("Sel_D");
    let cur_d_id = obj.selectedIndex;
    console.log(cur_d_id);
    if(cur_d_id+1 >30 ){

        return;
    }
    D_index+=1;
    obj.selectedIndex+=1;

    DDDD= String(D_index+1);
    Reload();
}

function Y_change(){
    let obj=document.getElementById("Sel_Y");
    Y_index = obj.selectedIndex ;

    if(Y_index<10) YYYY="200"+String(Y_index);
    else YYYY="20"+String(Y_index);

    Reload();
    
}
function M_change(){
    let obj=document.getElementById("Sel_M");
    M_index = obj.selectedIndex ;

    MMMM= String(M_index+1);
    Reload();
}
function D_change(){
    let obj=document.getElementById("Sel_D");
    D_index = obj.selectedIndex ;

    DDDD= String(D_index+1);
    Reload();
}


// ------ Clock Movement -----

function Clock_Movement(){
    const now=new Date();
    
    let hr= ( (now.getHours()+11)%12+1);
    let min=now.getMinutes();
    let sec=now.getSeconds();
    hr*=30;
    min*=6;
    sec*=6;

   
    document.querySelector(".H").style.transform = "rotate("+String(hr)+"deg)";
    document.querySelector(".M").style.transform = "rotate("+String(min)+"deg)";
    document.querySelector(".S").style.transform = "rotate("+String(sec)+"deg)";

}



Clock_Movement();
setInterval(Clock_Movement,1000);




fetch('http://127.0.0.1:8080/Data01.csv')
.then( function(res) {
    return res.text()
} )
.then( function(resp){
    Input = resp;
    console.log(Input);
    csvToArray(Input);
} )



Init_Option();

    

