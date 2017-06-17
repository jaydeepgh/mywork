var express = require("express");
var cors = require('cors');
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')


//following is to work with file stream
var fs = require("fs");
var csv = require("fast-csv");
var pkgcloud = require('pkgcloud');


var multer  = require('multer');

var services = JSON.parse(process.env.VCAP_SERVICES || '{}');
//var credentials = services['objectstorage'][0]['credentials'];



console.log();

var CONFIG = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: 'v3',
    authUrl: 'https://identity.open.softlayer.com',
    tenantId: '81c7632261aa4d4aad195126d83d60fc',    //projectId from credentials
    domainId: '8e571dd78cea4d27be559a78af5943a5',
    username: 'admin_5f3db519d0775b365528bb0d3f6f5408aed97e9a',
    password: 'E_\u0026UY(.t5q3F~Afc',
    region: 'dallas'   //dallas or london region
};




const CONTAINER = 'my-container';


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
    //console.log(upload_file_name);
    upload_to_storage();
  }
})
var upload = multer({ storage: storage });

// Configure file upload
app.use(upload.any());


//
// Upload
//
app.post('/upload', function(req, res){
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('Upload succeeded, please return to <a href="/">the main page</a>');
});


var upload_to_storage = function()
{
    var storageClient = pkgcloud.storage.createClient(CONFIG);

    storageClient.auth(function(err) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(storageClient._identity);
        }
    });

    storageClient.createContainer({
        name: CONTAINER
        }, function (err, container) {
        if (err) {
            console.error(err);
        }
        else {
            var myFile = fs.createReadStream(`./uploads/${upload_file_name}`);
            var upload = storageClient.upload({
                container: container.name,
                remote: upload_file_name
            });
            upload.on('error', function(err) {
                console.error(err);
            });
            upload.on('success', function(file) {
                console.log(file.toJSON());
            });
            myFile.pipe(upload);
        }
    });

}

app.get("/api/getdata", function (request, response) {
    var rdata = []; 
    
    if(upload_file_name==''){
        response.json(rdata);//JSON.stringify(data);
        return;
    }
    else{
        var storageClient = pkgcloud.storage.createClient(CONFIG);

        storageClient.auth(function(err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(storageClient._identity);
            }
        });

    storageClient.download({
        container: CONTAINER,
        remote: upload_file_name //'test.csv'
    })
        .pipe(csv())
        .on("data", function(data){
            rdata.push(data);
        })
        .on("end", function(){
            console.log("done");         
            response.json(rdata);//JSON.stringify(data);
            return;
        });    
    }

});

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});