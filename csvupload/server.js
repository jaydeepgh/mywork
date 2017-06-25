
var express = require("express");
var cors = require('cors');
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
const blockchain = require('./blockchain/blockchain');
const _ = require('lodash');
const logdb = require('./cloudant/log');
const INTERVAL = 6000;


//following is to work with file stream
var fs = require("fs");
var csv = require("fast-csv");


var multer  = require('multer');



let upload_file_name = ''; 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cors());



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    upload_file_name = file.originalname;

    //console.log(req.headers.uid);
    //console.log(file);
  }
  
})
var upload = multer({ storage: storage });

// Configure file upload
app.use(upload.any());

//let rec_count = 0;

//
// Upload post request
//
app.post('/api/upload', function(req, res){

    var role = req.headers.role;
    if(role === 'Assembly'){
        //console.log(req.headers);
        callAssemblyLine(upload_file_name, req.headers.uid, req.headers.node_url, req.headers.securecontext, req, res);        
    }
});




const callAssemblyLine = (filename, uid, node_url, secureContext, req, res) =>{
    let rdata = []; 
    let myFile = fs.createReadStream(`./uploads/${filename}`);
    myFile.pipe(csv())
    .on("data", function(data){
        rdata.push(data);
    })
    .on("end", function(){
        console.log('data count >>>>' + rdata.length);
        let offset = 0;
        let rowCount = 1;
        let chain_err = [];
        let timestamp = Date.now();
        if(rdata.length>0){
            _(rdata).each((item) => {                
                setTimeout(() => {
                    blockchain.AssemblyLineInvoke(item,uid,node_url, secureContext, (chain_res) =>{
                        //console.log(chain_res);
                        if(typeof chain_res != 'undefined'){
                            chain_err.push({ 
                                rowid: rowCount
                                , errorcode : chain_res.error_code                                
                                , code : chain_res.assembly_code
                                , status : chain_res.assembly_status                                
                                , message : chain_res.message
                            });
                        }    
                        rowCount++;                                            
                    });
                    

                },(0+offset));
                offset += INTERVAL;
            });
            //time to log into database
            setTimeout(()=>{
                logdb.saveLog(null, filename, timestamp, chain_err, (msg) =>{
                    console.log(msg);
                });
                
            },(rdata.length*INTERVAL));
        }
        
        fs.unlink(`./uploads/${filename}`);
        res.ContentType = "application/json"
        res.write(`{"noofrecord" : ${rdata.length.toString()}, "timestamp":${timestamp}}`);
        
        
        res.end();
    });
};

const callPackagingLine = (filename, uid, node_url, secureContext, req, res) =>{
    let rdata = []; 
    let myFile = fs.createReadStream(`./uploads/${filename}`);
    myFile.pipe(csv())
    .on("data", function(data){
        rdata.push(data);
    })
    .on("end", function(){
        //console.log('data count >>>>' + rdata.length);
        let offset = 0;
        let rowCount = 1;
        let chain_err = [];
        let timestamp = Date.now();
        if(rdata.length>0){
            _(rdata).each((item) => {                
                setTimeout(() => {
                    blockchain.PackagingLineInvoke(item,uid,node_url, secureContext, (chain_res) =>{
                        //console.log(chain_res);
                        if(typeof chain_res != 'undefined'){
                            chain_err.push({ 
                                rowid: rowCount
                                , errorcode : chain_res.error_code                                
                                , code : chain_res.packaging_code
                                , status : chain_res.packaging_status                                
                                , message : chain_res.message
                            });
                        }    
                        rowCount++;                                            
                    });
                    

                },(0+offset));
                offset += INTERVAL;
            });
            //time to log into database
            setTimeout(()=>{
                logdb.saveLog(null, filename, timestamp, chain_err, (msg) =>{
                    console.log(msg);
                });
                
            },(rdata.length*INTERVAL));
        }
        
        fs.unlink(`./uploads/${filename}`);
        res.ContentType = "application/json"
        res.write(`{"noofrecord" : ${rdata.length.toString()}, "timestamp":${timestamp}}`);
        
        
        res.end();
    });
};


//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 5000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});