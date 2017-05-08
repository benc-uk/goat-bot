// This loads the environment variables from the .env file
require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');
var util = require('util');
var captionService = require('./caption-service');
var needle = require('needle');

// Create bot and add dialogs
var settings = {
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
}
var connector = new builder.ChatConnector(settings);

//var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.onDefault([
    function (session, results) {
        if (hasImageAttachment(session)) {
            var stream = getImageStreamFromMessage(session.message);
            captionService
            .getCaptionFromStream(stream)
            .then(function (result) { 
                if(result.tags.indexOf("goat") >= 0) {
                    session.send("**NICE!** 😛 "+result.caption+"!  \nI give that goat a 12/10!!"); 
                } else {
                    session.send("Hey! that's no goat 😞. That looks like " + result.caption+"  \nPlease send me goat photos!"); 
                }
            })
            .catch(function (error) { session.send(error); });
        } else {

            session.send('🐐 Hello and welcome to **Goat Bot!** 🐐  \nYour friendly digital assistant for all your online goat requirements.  \nTry asking for *help* if you are stuck.');
        }
    }
]);

intents.matches(/(fact|info)/i, [
    function (session) {
        session.beginDialog('/fact');
    }  
]);

intents.matches(/(help)/i, [
    function (session) {
        session.beginDialog('/help');
    }  
]);

intents.matches(/(photo|picture)/i, [
    function (session) {
        session.beginDialog('/photo');
    }  
]);

bot.dialog('/fact', [
    function (session, args, next) {
        session.send('OK stand by for your amazing goat fact!  \nFetched from one of the worlds largest databases of goat facts...  ');
        
        var r = getRandomInt(0, goatFactsDB.length)
        var fact = goatFactsDB[r];
        session.send("\n** Goat fact \#" + r + ": " + fact + "**");
        session.endDialog();
    }
]);

bot.dialog('/help', [
    function (session, args, next) {
        session.send('There\'s lots I can do for you:  \n- Try asking for goat *fact* or *information*\n- Ask for *photos* of goats\n- Send me a photo (upload an image) and I\'ll rate your goat!');
        session.endDialog();
    }
]);

bot.dialog('/photo', [
    function (session, args, next) {
        sendGoatPhoto(session, "OK, here's a great goat photo for you from our **Goat Gallery**, enjoy!");
        session.endDialog();
    }
]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});


var goatFactsDB = [
    "Goats live between 15 and 18 years",
    "Baby goats are called 'kids'",
    "'Buck' is the name used for adult male goats and 'Doe' is for adult females",
    "Goats were one of the first animals to be tamed by humans",
    "Goat meat is the most consumed meat per capita worldwide",
    "Goats can be taught their name and to come when called",
    "Goats’ pupils (like many hooved animals) are rectangular. This gives them vision for 320 to 340 degrees",
    "Goats are ruminants and have four 'stomachs'",
    "Goats are members of the Bovidae family, which also includes antelopes, cattle and sheep",
    "Goats are very social creatures and live in groups called herds, which may contain as many as 20 goats in the wild",
    "There are over 200 recognized breeds of goat",
    "Goats have no upper front teeth; their upper front mouth is one big gum",
    "Goats are social herd animals and can become depressed if kept alone",
    "It is a myth that goats eat tin cans or garbage.",
    "Goats are good swimmers",
    "Mohair comes from the Angora goat",
    "Cashmere comes from the Cashmere goat",
    "A group of goats has multiple acceptable names including herd, trip, and tribe",
    "Around the globe more people eat and drink meat and milk from goats than any other animal"
]

function sendGoatPhoto(session, text) {
    var goat_count = fs.readdirSync('./images/').length;
    r = getRandomInt(1, goat_count + 1);
    session.send("Random goat "+r+" of "+goat_count);

    fs.readFile('./images/goat' + r + '.jpg', function (err, data) {
        if (err) {
            return session.send('Oops. Error reading goat photo file.');
        }

        var base64 = Buffer.from(data).toString('base64');

        var msg = new builder.Message(session)
            .addAttachment({
                contentUrl: util.format('data:%s;base64,%s', 'image/jpeg', base64),
                contentType: 'image/jpeg',
                name: "Goat Photo " + r
            });
        msg.text(text);

        session.send(msg);
    });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function hasImageAttachment(session) {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1;
}

function getImageStreamFromMessage(message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (checkRequiresToken(message)) {
        // The Skype attachment URLs are secured by JwtToken,
        // you should set the JwtToken of your bot as the authorization header for the GET request your bot initiates to fetch the image.
        // https://github.com/Microsoft/BotBuilder/issues/662
        connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return needle.get(attachment.contentUrl, { headers: headers });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return needle.get(attachment.contentUrl, { headers: headers });
}

function checkRequiresToken(message) {
    return message.source === 'skype' || message.source === 'msteams';
}