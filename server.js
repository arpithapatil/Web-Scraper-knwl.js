var readline = require('readline');
var express = require('express');
var Knwl = require('./knwl.js');
var fs = require('fs');
var axios = require('axios');
CircularJSON = require('circular-json');

var knwlInstance = new Knwl('english');
knwlInstance.register('phones', require('./default_plugins/phones'));
knwlInstance.register('emails', require('./default_plugins/emails'));


var app = express();


function validateEmail(ans) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = (reg.test(ans.toLowerCase()));
    if(result === false){
        console.log('invalid email address')
    }
    else if (result === true){
    var valid = ans.split('@');
    var web = 'www.'+valid[1];
    }
  return web;
    };

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Input an emailadress? ', (answer) => {
        var ans = answer.toString();
        var web = validateEmail(ans);
        url = `https://${web}`;
        axios.get(url)
        .then(response => {
            var json = CircularJSON.stringify(response, null, 4);
            cleanText = json.replace(/<\/?[^>]+(>|$)/g, "");
            clearText = cleanText.replace(/\\n/g, '')
            cleanerText = clearText.replace(/\\/g,'')
            // console.log(cleanerText);
            knwlInstance.init(cleanerText);
          var email =(knwlInstance.get('emails'));
          console.log(email);
        })
        .catch(error => console.log(error));
    rl.close();
    
    });

  
    

    app.listen('8081');
    exports = module.exports = app;
    