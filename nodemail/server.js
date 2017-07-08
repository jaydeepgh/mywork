
const express = require("express");
const cors = require('cors');
var app = express();
const nodemailer = require('nodemailer');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.post('/api/sendmail', function(req,res){

    //console.log(req.body);


// create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'BH-PLESK-WEB1.webhostbox.net',
        port: parseInt(587, 10),
        requiresAuth: true,
        secure: false, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'noreply@aum-express.com',
            pass: 'Nore1234*'
        }
    });    
    /*let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'Aumexpress1@gmail.com',
            pass: 'Passw0rd1'
        }
    });*/

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'noreply@aum-express.com', // sender address
        to: 'info@aum-express.com, chandan.sharma@aum-express.com, fozaila@aum-express.com, avhijit11@yahoo.com', // list of receivers
        subject: req.body.subject, // Subject line
        text: `${req.body.description} (Ph number : ${req.body.phoneno}, Email : ${req.body.email})`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            return;
        }
        res.write('Mail has been successfully delivered.');
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.end();
    });
});


app.post('/api/franchisee', function(req,res){

    //console.log(req.body);


// create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'BH-PLESK-WEB1.webhostbox.net',
        //port: 25,
        port: parseInt(587, 10),
        requiresAuth: true,        
        secure: false, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'noreply@aum-express.com',
            pass: 'Nore1234*'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'noreply@aum-express.com', // sender address
        to: 'info@aum-express.com, chandan.sharma@aum-express.com, fozaila@aum-express.com, avhijit11@yahoo.com', // list of receivers
        subject: 'Franchisee Enquiry', // Subject line
        html : `<b>Name : </b>${req.body.name}<br /> <b>Contact Name : </b>${req.body.contact}<br /> <b>Address : </b>${req.body.address}<br /><b>Email : </b>${req.body.email}<br /> <b>Phone No : </b>${req.body.phoneno}`
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            return;
        }
        res.write('Franchisee enquiry request sent successfully.');
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.end();
    });
});







var port = process.env.PORT || 5050
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});