var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'f0a59aab-a8a0-4d62-82d4-3d25a5488543',
    appPassword: 'N9oEmM2R1aAr7nRQJnNbLc3'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

    // Client access token from api.ai
    var recognizer = new apiairecognizer("0f8de20c6e484458b79e18dd952b0451");

    var intents = new builder.IntentDialog({
            recognizers: [recognizer]
    });

bot.dialog('/',intents);

intents.matches('ask_cost',[
   function(session,args){
        var cost = builder.EntityRecognizer.findEntity(args.entities,'cost');
        if (cost){
            //var cost_name = cost.entity;
            //session.send(cost_name);
            var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
            if (fulfillment) {
                var speech = fulfillment.entity;          
                session.send(speech);
            }
        }else{
            builder.Prompts.text(session, '你想查詢工程費用?');
        }
    },
    function(session,results){
        var answer = results.response;
        session.send(answer);
    }
]);

intents.onDefault(function(session){
    session.send("不清楚，請再發問。");
});

/** 
intents.matches('whatIsWeather',[
    function(session,args){
        var city = builder.EntityRecognizer.findEntity(args.entities,'cost');
        if (city){
            var city_name = city.entity;
            var url = "http://api.apixu.com/v1/current.json?key=7dd32ec48606429db78111355162912&q=" + city_name;
            request(url,function(error,response,body){
                body = JSON.parse(body);
                temp = body.current.temp_c;
                session.send("It's " + temp + " degrees celsius in " + city_name);
            });
        }else{
            builder.Prompts.text(session, 'Which city do you want the weather for?');
        }
    },
    function(session,results){
        var city_name = results.response;
        var url = "http://api.apixu.com/v1/current.json?key=7dd32ec48606429db78111355162912&q=" + city_name;
            request(url,function(error,response,body){
                body = JSON.parse(body);
                temp = body.current.temp_c;
                session.send("It's " + temp + " degrees celsius in " + city_name);
        });
    }
]);
**/

/** 
intents.matches('smalltalk.greetings',function(session, args){
    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment){
        var speech = fulfillment.entity;
        session.send(speech);
    }else{
        session.send('Sorry...not sure how to respond to that');
    }
}); **/