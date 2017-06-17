var _ = require('lodash');
//var msg = 'hello world';
//console.log(msg);


var a = [
    {id:'a', value:1}
,    {id:'b', value:1}
,    {id:'c', value:1}
,    {id:'a', value:3}
,    {id:'d', value:1}
,    {id:'a', value:2}
,    {id:'b', value:2}
,    {id:'c', value:2}
,    {id:'d', value:2}

    ]

/*
var t1 = a.map((x) =>{
    return _.filter(a,_.matches({'id':x.id}));

});
*/ // _.sortBy(a, _.property(['value']))
var t = _.map(_.sortBy(a, _.property(['id']))); 
var _id = '';
var t1 = t.map((x) => {
    if(_id != x.id){
        _id = x.id;
        return _.head(_.sortBy(_.filter(a, _.matches({'id' : x.id})), _.property(['value'])).reverse());
    }

});
var result = _.filter(t1, (x) =>{if(typeof x != 'undefined'){return x;}});

//_.map(a, _.property('id'), _property('value'));
//console.log([result,a]);

/*
var date1 = new Date(2017, 5, 22);
var date2 = new Date(2017, 5, 22);
var diff = new Date(date2.getTime() - date1.getTime());
// diff is: Thu Jul 05 1973 04:00:00 GMT+0300 (EEST)
//y = ((diff.getUTCFullYear() - 1970) * 365);
//m = (diff.getUTCMonth() * 30);
//d = (diff.getUTCDate() - 1)


var dt = '2017-5-22';
console.log(dt.replace("-","").replace('-',''));


console.log(((((diff/1000)/60)/60)/24)+1);


console.log(diff.getUTCFullYear() - 1970); // Gives difference as year
// 3

console.log(diff.getUTCMonth()); // Gives month count of difference
// 6

console.log(diff.getUTCDate() - 1); // Gives day count of difference
// 4
*/
/*

const dateToNum = (dt) =>{
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

console.log(dateToNum(new Date(2017,7,1)));

*/


var fromDt = new Date(2017, 4, 24);
var toDt = new Date(2017,4,31);
var diff = new Date(toDt.getTime() - fromDt.getTime());
var totNoOfDays = (((((diff/1000)/60)/60)/24)+1);
var chartData = [];

var dtCounter = fromDt;
var nDtCounter = 0;
for(var i=0;i<totNoOfDays;i++){
    nDtCounter = parseInt(`${dtCounter.getFullYear()}${dtCounter.getMonth()}${dtCounter.getDate()}`);
    console.log(`${dtCounter.getDate()}`);

        dtCounter = new Date(dtCounter.getTime() + (1 * 24 * 60 * 60 * 1000));
    }












