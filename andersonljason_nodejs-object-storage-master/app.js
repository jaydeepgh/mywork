/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');
var multer  = require('multer');
var request = require('request');

var USER = "user"
var CONTAINER = "usercontainer"

// setup middleware
var app = express();

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Configure file upload
app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    // console.log(' Buffer Content  ' + file.buffer)
    // UPLOAD THE FILE TO THE OBJECT STORE
    if (!auth) { set_app_vars(); }
    var user_info = cache[USER];

    var res_handler = function(error, response, body) {};
    var buff = new Buffer(file.buffer, 'binary');

    upload_file_to_swift(USER, CONTAINER, file.originalname, buff.toString('base64'), res_handler);
  },
  inMemory: true
}));

app.use(app.router);
app.use(express.errorHandler());
app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views
app.engine('html', require('ejs').renderFile);

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || '{}');
console.log("--- Services Object: ");
console.log(services);
console.log("--- Credentials Object: ");
if (Object.keys(services).length > 0) {
  console.log(services['objectstorage'][0]['credentials']);
}

var cache = {};
var auth = null;

//
//
// Utility Methods
//
//
var set_app_vars = function() {
  var credentials = services['objectstorage'][0]['credentials'];
  // console.log("set_app_vars - auth_uri: " + credentials['auth_uri']);
  // console.log("set_app_vars - userid: " + credentials['username']);
  // console.log("set_app_vars - password: " + credentials['password']);
  auth = {"auth_uri": credentials['auth_uri'],
     "userid" : credentials['username'],
     "password" : credentials['password'],
  };
  auth["secret"] = "Basic " +
    Buffer(auth.userid + ":" + auth.password).toString("base64");
  // console.log("set_app_vars - auth: " + JSON.stringify(auth, null, 2));
};

function json_response(res, json) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(JSON.stringify(json, null, 2));
}

var get_token = function(userid, callback) {
  if (!auth) { set_app_vars(); }

  var req_options = {
    url: auth.auth_uri + '/' + userid,
    headers: {'accept': 'application/json',
                'Authorization': auth.secret},
    timeout: 100000,
    method: 'GET'
  };

  console.log(JSON.stringify(req_options, null, 2));
  request(req_options, callback);
}

// Must have called the token method before this one to init (user_info)
var create_container = function(userid, containername, callback) {
  var user_info = cache[userid];

  var req_options = {
    url: user_info['url'] + "/" + containername,
    headers: {'accept': 'application/json',
           'X-Auth-Token': user_info['token']},
    timeout: 100000,
    method: 'PUT'
  };

  request(req_options, callback);
}

var list_container = function(userid, containername, callback) {
  var user_info = cache[userid];

  var req_options = {
    url: user_info['url'] + "/" + containername,
    headers: {'accept': 'application/json',
           'X-Auth-Token': user_info['token']},
    timeout: 100000,
    method: 'GET'
  };

  request(req_options, callback);
}

var upload_file_to_swift = function(userid, containername, objname, objdata, callback) {
  var user_info = cache[userid];

  var req_options = {
    url: user_info['url'] + "/" + containername + "/" +
      objname,
    headers: {'accept': 'application/json',
       'X-Auth-Token': user_info['token']},
    timeout: 100000,
    body: objdata,
    method: 'PUT'
  };

  request(req_options, callback);
}

var download_file_from_swift = function(userid, containername, objname, callback) {
  var user_info = cache[userid];

  var req_options = {
    url: user_info['url'] + "/" + containername + "/" +
      objname,
    headers: {'accept': 'application/json',
       'X-Auth-Token': user_info['token']},
    timeout: 100000,
    //body: "Some random data",
    method: 'GET'
  };

  request(req_options, callback);
}

var delete_file_from_swift = function(userid, containername, objname, callback) {
  var user_info = cache[userid];
  console.log("Deleting " + objname + " from " + userid + "/" + containername)
  var req_options = {
    url: user_info['url'] + "/" + containername + "/" +
      objname,
    headers: {'accept': 'application/json',
       'X-Auth-Token': user_info['token']},
    timeout: 100000,
    //body: "Some random data",
    method: 'DELETE'
  };

  request(req_options, callback);
}

var render_index = function(res, containerListingJSON) {
  var fileList = JSON.parse(containerListingJSON)
  containerFiles = fileList.map(function(val) {
    return val.name
  });

  res.render('main.html', { containerFiles: containerFiles });
}

//
//
// REST APIs
//
//


//
// Get index page
//
app.get('/', function(req, res){
  // Must already have the service attached
  if (Object.keys(services).length > 0) {

    // Create container
    get_token(USER, function(error, response, body) {

      if (!error) {
        save_token_response_to_cache(USER, response.headers['x-auth-token'], response.headers['x-storage-url']);

        create_container(USER, CONTAINER, function(error, response, body) {

          if (!error) {
            console.log('Finished creating container');
            // List files
            list_container(USER, CONTAINER, function(error, response, body) {

              if (!error) {
                console.log('Finished listing container');

                render_index(res, body);
              } else {
                res.end('Issue listing a container');
              }
            });
          } else {
            res.end('Issue creating a container');
          }
        });
      } else {
        res.end('Issue getting a token');
      }
    });
  } else {
    res.render('no_object_storage.html');
  }
});

//
// Upload
//
app.post('/upload', function(req, res){
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('Upload succeeded, please return to <a href="/">the main page</a>');
});

//
// Download
//
app.get('/download/:objname', function(req, res){
  var res_handler = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var buff = new Buffer(body, 'base64')
      var data = buff.toString('binary');

      contentType = "";
      if (req.params.objname.endsWith(".jpg") || req.params.objname.endsWith(".jpeg")) {
        contentType = "image/jpeg";
      }
      else if (req.params.objname.endsWith(".gif")) {
        contentType = "image/gif";
      }
      else if (req.params.objname.endsWith(".png")) {
        contentType = "image/png";
      }
      else if (req.params.objname.endsWith(".bmp")) {
        contentType = "image/bmp";
      }
      else if (req.params.objname.endsWith(".pdf")) {
        contentType = "application/pdf";
      }
      else {
        contentType = "text/plain";
      }
      
      console.log("Downloading a " + contentType)
      res.writeHead(200, {"Content-Type": contentType});
      res.end(data, 'binary');
    }
    else {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end('Failed downloading ' + req.params.objname);
    }
  };

  download_file_from_swift(USER, CONTAINER, req.params.objname, res_handler);
});

//
// Delete
//
app.get('/delete/:objname', function(req, res){
  var res_handler = function(error, response, body) {
    if (!error && response.statusCode == 204) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end('Delete succeeded, please return to <a href="/">the main page</a>');
    }
    else {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end('Delete did not succeed, please return to <a href="/">the main page</a> (Response Code: ' + response.statusCode + ', Error: ' + error + ')');
    }
  };

  delete_file_from_swift(USER, CONTAINER, req.params.objname, res_handler);
});

var save_token_response_to_cache = function(userid, token, url) {
  var body = {"userid": userid,
     "token": token,
     "url": url};
  cache[userid] = body;
  return body;
}


//
// Get token
//
app.get('/gettoken/:userid', function(req, res){

  var res_handler = function(error, response, res_body) {
    var body = {};
    if (!error && response.statusCode == 200) {
      body = save_token_response_to_cache(req.params.userid, response.headers['x-auth-token'], response.headers['x-storage-url']);
    }
    else {
      body = {"error": error, "statusCode": response.statusCode};
    };
    // res.render('results', {"body": body});

    json_response(res, body);
  };


  get_token(req.params.userid, res_handler);
});

//
// Create container
//
app.get('/createcontainer/:userid/:containername', function(req, res){
  
  var res_handler = function(error, response, body) {
    if (!error && (response.statusCode == 201 ||
         response.statusCode == 204)) {
      body = {result: 'Succeeded!'};
    }
    else {
      body = {result: 'Failed!'};
    }

    json_response(res, body);
  };

  create_container(req.params.userid, req.params.containername, res_handler)
});

//
// Write Object
//
app.get('/writeobj/:userid/:containername/:objname', function(req, res){

  var res_handler = function(error, response, body) {
    if (!error && response.statusCode == 201) {
      body = {result: 'Succeeded!'};
    }
    else {
      body = {result: 'Failed!'};
    }

    json_response(res, body);
  };

  upload_file_to_swift(req.params.userid, req.params.containername, req.params.objname, "Some random data",  res_handler);
});

//
// Read Object
//
app.get('/readobj/:userid/:containername/:objname', function(req, res){

  var res_handler = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      body = {result: 'Succeeded! ' + body +  ' - ' + response};
    }
    else {
      body = {result: 'Failed!'};
    }

    json_response(res, body);
  };

  download_file_from_swift(req.params.userid, req.params.containername, req.params.objname,  res_handler);
});

//
// List files in container
//
app.get('/listcontainer/:userid/:containername', function(req, res){
  
  var res_handler = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var fileList = JSON.parse(body)
      body = {result: 'Succeeded! ' + fileList[0].name};
    }
    else {
      body = {result: 'Failed!'};
    }

    json_response(res, body);
  };

  list_container(req.params.userid, req.params.containername, res_handler)
});


// app.get('/download/:filename', function(req, res){
//   fs = require('fs')
//   fs.readFile('/etc/hosts', 'utf8', function (err,data) {
//     if (err) {
//       return console.log(err);
//     }
//     console.log(data);
//   });
//   text_response(res, {"text": "Uploaded"});
// });

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);

