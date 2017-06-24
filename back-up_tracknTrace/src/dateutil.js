import _ from 'lodash';
var month = [
    {seq:1, month:'Jan'},
    {seq:2, month:'Feb'},
    {seq:3, month:'Mar'},    
    {seq:4, month:'Apr'},    
    {seq:5, month:'May'},    
    {seq:6, month:'Jun'},    
    {seq:7, month:'Jul'},    
    {seq:8, month:'Aug'},    
    {seq:9, month:'Sep'},    
    {seq:10, month:'Oct'},    
    {seq:11, month:'Nov'},    
    {seq:12, month:'Dec'},            
    ];

export const formatedDate = (dtstr) =>{
    var adt = dtstr.split('-');
    var m = _.filter(month,_.matches({'seq':parseInt(adt[1])}))[0].month;
    return `${adt[2]}-${m}-${adt[0]}`;
}

export const formatedDateTimeFromNum = (num) =>{
    
    var adt = num.toString();
    var y = adt.substring(0,4);
    var m = adt.substring(4,6);
    var d = adt.substring(6,8);
    var h = adt.substring(8,10);
    var min = adt.substring(10,12);
    var sec = adt.substring(12,14);
    //console.log(m);
    var strM = _.filter(month,_.matches({'seq':parseInt(m)}))[0].month;
    return `${d}-${strM}-${y} ${h}:${min}`;
}




export const dateToNum = (dt) =>{
    var nDt = 0;
    var pad = "00"    
    var m = (dt.getMonth() + 1).toString();
    var d = dt.getDate().toString();
    var y = dt.getFullYear().toString();
    m = pad.substring(0, pad.length - m.length) + m;
    d = pad.substring(0, pad.length - d.length) + d;
    nDt = parseInt(`${y}${m}${d}`);
    return nDt;
}

export const dateToStr = (dt) =>{
    var m = (dt.getMonth() + 1).toString();
    var d = dt.getDate().toString();
    var y = dt.getFullYear().toString();    
    return `${y}-${m}-${d}`
}



export const datetimeToStr = (dt) =>{
    var cdt = new Date(Date.now());

    var pad = "00"    
    var m = (dt.getMonth() + 1).toString();
    var d = dt.getDate().toString();
    var y = dt.getFullYear().toString();
    var h = cdt.getHours().toString();
    var min = cdt.getMinutes().toString();
    var sec = cdt.getSeconds().toString();

    m = pad.substring(0, pad.length - m.length) + m;
    d = pad.substring(0, pad.length - d.length) + d;
    h = pad.substring(0, pad.length - h.length) + h;
    min = pad.substring(0, pad.length - min.length) + min;
    sec = pad.substring(0, pad.length - sec.length) + sec;

    return `${y}${m}${d}${h}${min}${sec}`
}

export const strToDate = (str) => {
    var aStr = str.split('-');
    return new Date(aStr[0], (aStr[1] -1), aStr[2]);
}

export const numToDate = (num) => {
    var adt = num.toString();
    var y = parseInt(adt.substring(0,4));
    var m = parseInt(adt.substring(4,6));
    var d = parseInt(adt.substring(6,8));
    var h = parseInt(adt.substring(8,10));
    var min = parseInt(adt.substring(10,12));
    var sec = parseInt(adt.substring(12,14));
    var dt = new Date(y, (m-1),d,h,min,sec);
    return dt;
}