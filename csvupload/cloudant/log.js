// Load the Cloudant library.
const dburl = 'https://308a935e-cc36-4433-8ad7-b5aae97978e4-bluemix:01d909e364907c54d9e08f1125dbac5bdd27f021f94151436d4bad02742d2368@308a935e-cc36-4433-8ad7-b5aae97978e4-bluemix.cloudant.com'
var Cloudant = require('cloudant'); //(dburl);
var cloudant = Cloudant({url: dburl, plugin:'promises'});

//create dbconnection
let dbConn = cloudant.use('tracktracelog');

exports.saveLog = function(id, filename, timestamp, values, callback) {

    if (id === undefined) {
        // Generated random id
        id = '';
    }
   //console.log(values);
    dbConn.insert({filename:filename
        , timestamp : timestamp
        ,values
    }, id, function(err, doc) {
        if (err) {
            callback(err);
            //return false;
            //response.sendStatus(500);
        } else {
            callback('DB insert success for ' + filename);
            //return true;
        }
    });
}

