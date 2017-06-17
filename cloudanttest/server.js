var _ = require('lodash');
var express = require("express");
var cors = require('cors');
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
// parse application/json
app.use(bodyParser.json())



// Load the Cloudant library.
const dburl = 'https://308a935e-cc36-4433-8ad7-b5aae97978e4-bluemix:01d909e364907c54d9e08f1125dbac5bdd27f021f94151436d4bad02742d2368@308a935e-cc36-4433-8ad7-b5aae97978e4-bluemix.cloudant.com'
var Cloudant = require('cloudant'); //(dburl);
var cloudant = Cloudant({url: dburl, plugin:'promises'});

//Utility functions

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

const strToDate = (str) => {
    var aStr = str.split('-');
    return new Date(aStr[0], (aStr[1] -1), aStr[2]);
}


//create dbconnection
let dbConn = cloudant.use('tracktrace');


var saveDocument = function(id, type, values) {

    if (id === undefined) {
        // Generated random id
        id = '';
    }
   //console.log(values);
    dbConn.insert({type:type,values
    }, id, function(err, doc) {
        if (err) {
            console.log(err);
            return false;
            //response.sendStatus(500);
        } else {
            console.log('DB insert success for ' + type);
            return true;
        }
    });
}

app.get('/api/getassembly', function(request, response) {

    var fdt = request.query.fromdt;
    var tdt = request.query.todt;
    var aFromDate = fdt.split('-');
    var aToDate = tdt.split('-');

    var fromDt = dateToNum(strToDate(fdt));//  parseInt(fdt.replace('-','').replace('-',''));
    var toDt = dateToNum(strToDate(tdt)); // parseInt(tdt.replace('-','').replace('-',''));
    

        dbConn.find({
        "selector": {
            "$and" : [
            {"type" : "assembly"},    
            {"values.assemblyCreationDate": {
                    "$gte": fromDt
                }
            },
            {"values.assemblyCreationDate": {            
                    "$lte": toDt
                }
            }
            ]
        },
        "fields": [
            "type"
                ,"values.assemblyId"
                ,"values.deviceSerialNo"
                ,"values.deviceType"
                ,"values.filamentBatchId"
                ,"values.ledBatchId"
                ,"values.circuitBoardBatchId"
                ,"values.wireBatchId"
                ,"values.casingBatchId"        
                ,"values.adaptorBatchId"
                ,"values.stickPodBatchId"
                ,"values.manufacturingPlant"
                ,"values.assemblyStatus"
                ,"values.assemblyCreationDate"
                ,"values.assemblyCreationDateView"
                ,"values.assemblyCreatedBy"
        ],
        "sort": [
            {
            "values.assemblyCreationDate": "asc"
            }
        ]
    }).then(function(data) {
                var res = data.docs.map((item) => {
                                return item.values;
                            });
                var result =  getAssemblyLineDetails(res,aFromDate, aToDate);            
                response.json(result);
                return;
        }).catch(function(err) {
            console.log('something went wrong', err);
            return;
        });
})

function getAssemblyLineDetails(data, fromDts, toDts){

    //console.log(data);
    //console.log()
    var assemblyListDetails = data;
    var fromDt = new Date(fromDts[0], (fromDts[1] - 1), fromDts[2]);
    var toDt = new Date(toDts[0],(toDts[1] -1),toDts[2]);
    var diff = new Date(toDt.getTime() - fromDt.getTime());
    var totNoOfDays = (((((diff/1000)/60)/60)/24)+1);
    var chartData = [];

    var dtCounter = fromDt;
    var nDtCounter = 0;
    for(var i=0;i<totNoOfDays;i++){
        nDtCounter = dateToNum(dtCounter); // parseInt(`${dtCounter.getFullYear()}${dtCounter.getMonth()+1}${dtCounter.getDate()}`);
        //console.log(nDtCounter);
        var chartItem = {
            'date' : `${dtCounter.getDate()}`
            , 'Created' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '1' ) return x;
                }).length
            ,  'QA Failed' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '2' ) return x;
                }).length
            , 'Rectified' :_.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '3' ) return x;
                }).length
            , 'QA Tested' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '4' ) return x;
                }).length
            , 'Codentified' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '5' ) return x;
                }).length    
            , 'Ready for Packaging' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '6' ) return x;
                }).length
            , 'Packaged' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '7' ) return x;
                }).length
            , 'Cancelled' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '8' ) return x;
                }).length
            , 'InActive' : _.filter(assemblyListDetails, (x) =>{
                    if(x.assemblyCreationDate == nDtCounter && x.assemblyStatus == '9' ) return x;
                }).length   
        }
        chartData.push(chartItem);
        dtCounter = new Date(dtCounter.getTime() + (1 * 24 * 60 * 60 * 1000));
    }

    var t = _.map(_.sortBy(data, _.property(['assemblyId'])));
    var _assemblyId = '';
    var t1 = t.map((x) => {
        if(_assemblyId != x.assemblyId){
            _assemblyId = x.assemblyId;
            return _.head(_.sortBy(_.filter(data, _.matches({'assemblyId' : x.assemblyId})), _.property(['assemblyStatus'])).reverse());
        }

    });
    var assembList = _.filter(t1, (x) =>{if(typeof x != 'undefined'){return x;}});


    return [assembList, assemblyListDetails, chartData];
}

app.post('/api/assembly/save', function(request, response) {
        var elemntAssm = {
            assemblyId : request.body.assemblyId //Date.now().toString() 
            , deviceSerialNo : sanitizeInput(request.body.deviceSerialNo)
            , deviceType : sanitizeInput(request.body.deviceType)
            , filamentBatchId : sanitizeInput(request.body.filamentBatchId)
            , ledBatchId : sanitizeInput(request.body.ledBatchId)
            , circuitBoardBatchId : sanitizeInput(request.body.circuitBoardBatchId)
            , wireBatchId : sanitizeInput(request.body.wireBatchId)
            , casingBatchId : sanitizeInput(request.body.casingBatchId) 
            , adaptorBatchId : sanitizeInput(request.body.adaptorBatchId)
            , stickPodBatchId : sanitizeInput(request.body.stickPodBatchId)
            , manufacturingPlant : sanitizeInput(request.body.manufacturingPlant)
            , assemblyStatus : sanitizeInput(request.body.assemblyStatus)
            , assemblyCreationDate : request.body.assemblyCreationDate
            , assemblyCreationDateView : sanitizeInput(request.body.assemblyCreationDateView)
            , assemblyCreatedBy : sanitizeInput(request.body.assemblyCreatedBy)
        };

   saveDocument(null, 'assembly', elemntAssm, response);//.then(()=>{response.sendStatus(200);}).catch((err) =>{response.sendStatus(500);});
   response.sendStatus(200);
   response.end();
});


app.post('/api/packaging/save', function(request, response) {

    if(parseInt(request.body.packageStatus)>0){
        var elemntPackag = {
            caseId : request.body.caseId 
            , holderAssemblyId : sanitizeInput(request.body.holderAssemblyId)
            , chargerAssemblyId : sanitizeInput(request.body.chargerAssemblyId)
            , packageStatus : sanitizeInput(request.body.packageStatus)
            , packagingDate : request.body.packagingDate
            , packageCreationDateView : sanitizeInput(request.body.packageCreationDateView)
            , shippingToAddress : sanitizeInput(request.body.shippingToAddress)
            , packageCreatedBy : sanitizeInput(request.body.packageCreatedBy) 
        };
        saveDocument(null, 'packaging', elemntPackag, response);
    }
   //create log for associated assemblies
   if(request.body.packageStatus!='2' && request.body.packageStatus!='0'){
        var updateAssemblies = request.body.updateAssemblies;
        if( typeof updateAssemblies != 'undefined' && updateAssemblies.length > 0){
            updateAssemblies.map((item)=>{
                    saveDocument(null, 'assembly', item, response);
            });
        }
   }
   response.sendStatus(200);
   response.end();
});


app.get('/api/getpackaging', function(request, response) {

    var fdt = request.query.fromdt;
    var tdt = request.query.todt;
    var aFromDate = fdt.split('-');
    var aToDate = tdt.split('-');

    var fromDt = dateToNum(strToDate(fdt));//  parseInt(fdt.replace('-','').replace('-',''));
    var toDt = dateToNum(strToDate(tdt)); // parseInt(tdt.replace('-','').replace('-',''));
    

        dbConn.find({
        "selector": {
            "$and" : [
            {"type" : "packaging"},    
            {"values.packagingDate": {
                    "$gte": fromDt
                }
            },
            {"values.packagingDate": {            
                    "$lte": toDt
                }
            }
            ]
        },
        "fields": [
            "type"
                ,"values.caseId"
                ,"values.holderAssemblyId"
                ,"values.chargerAssemblyId"
                ,"values.packageStatus"
                ,"values.packagingDate"
                ,"values.packageCreationDateView"
                ,"values.shippingToAddress"
                ,"values.packageCreatedBy"  
        ],
        "sort": [
            {
            "values.packagingDate": "asc"
            }
        ]
    }).then(function(data) {
                var res = data.docs.map((item) => {
                                return item.values;
                            });
                var result =  getPackagingDetails(res,aFromDate, aToDate);            
                response.json(result);
                return;
        }).catch(function(err) {
            console.log('something went wrong', err);
            return;
        });
})

function getPackagingDetails(data, fromDts, toDts){

    //console.log(data);
    //console.log()
    var packagingListDetails = data;
    var fromDt = new Date(fromDts[0], (fromDts[1] - 1), fromDts[2]);
    var toDt = new Date(toDts[0],(toDts[1] -1),toDts[2]);
    var diff = new Date(toDt.getTime() - fromDt.getTime());
    var totNoOfDays = (((((diff/1000)/60)/60)/24)+1);
    var chartData = [];

    var dtCounter = fromDt;
    var nDtCounter = 0;
    for(var i=0;i<totNoOfDays;i++){
        nDtCounter = dateToNum(dtCounter); // parseInt(`${dtCounter.getFullYear()}${dtCounter.getMonth()+1}${dtCounter.getDate()}`);
        //console.log(nDtCounter);
        var chartItem = {
            'date' : `${dtCounter.getDate()}`
            , 'Packaging Complete' : _.filter(packagingListDetails, (x) =>{
                    if(x.packagingDate == nDtCounter && x.packageStatus == '1' ) return x;
                }).length
            , 'Shipped' : _.filter(packagingListDetails, (x) =>{
                    if(x.packagingDate == nDtCounter && x.packageStatus == '2' ) return x;
                }).length
            , 'Cancelled' : _.filter(packagingListDetails, (x) =>{
                    if(x.packagingDate == nDtCounter && x.packageStatus == '3' ) return x;
                }).length                                
        }
        chartData.push(chartItem);
        dtCounter = new Date(dtCounter.getTime() + (1 * 24 * 60 * 60 * 1000));
    }

    var t = _.map(_.sortBy(data, _.property(['caseId'])));
    var _caseId = '';
    var t1 = t.map((x) => {
        if(_caseId != x.caseId){
            _caseId = x.caseId;
            return _.head(_.sortBy(_.filter(data, _.matches({'caseId' : x.caseId})), _.property(['packageStatus'])).reverse());
        }

    });
    var packagingList = _.filter(t1, (x) =>{if(typeof x != 'undefined'){return x;}});


    return [packagingList, packagingListDetails, chartData];
}

function sanitizeInput(str) {
    return String(str).replace(/&(?!amp;|lt;|gt;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


