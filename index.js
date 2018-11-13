const SlackBot = require('slackbots');
const Axios = require('axios');
const BotData = require('./bot-data.js');

const bot = new SlackBot({
    token : BotData.getBotToken(),
    name : BotData.getBotName()
});

const DefaultSlackChannel = 'zasciankowemenu';
const DefaultParams = {
    icon_emoji: ':robot_face:'
  };

const WelcomeMessage = 'Eloszka, przygotujcie się na to, że dostaniecie dzisiejsze menu :3';
const HelpMessage = `Napisz '@zascianekbot dzisiaj' aby dostać informację o dzisiejszym menu.`;
const HelloMessage = 'Siema, siema! Mam nadzieję, że u Ciebie wszystko w porządku!';
const YouAreWelcomeMessage = 'Nie ma za co! Polecam się na przyszłość!';

const ZascianekKeywords = ['dzisiaj', 'menu', 'lunch', 'zascianku', 'obiad'];
const HelloKeywords = ['cześć', 'hej', 'elo', 'siemaneczko', 'siema', 'witaj'];
const ThankYouKeywords = ['dzięki', 'dziena', 'dzieny', 'dziękuję', 'thx', 'ty'];
const HelpKeyword = 'pomoc';

const GimmeDatAPIEndpoint = 'https://gimmedatapi.gear.host/api/ZascianekData';

// Start handler
bot.on('start', () => {   
    bot.postMessageToGroup(
        DefaultSlackChannel,
        WelcomeMessage,
        DefaultParams
    );
});

// Error handler
bot.on('error', error => console.log(error));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message' || data.subtype == 'bot_message') {
        return;
    }
  
    handleMessage(data.text, data.channel);
  });

// Message responder
function handleMessage(messageText, communicationChannel) {
    if(messageText.includes(HelpKeyword)) {
        showHelp(communicationChannel);
    }
    else if (messageContainKeywords(messageText, ZascianekKeywords)) {
        serveMenu(communicationChannel);
    }
    else if (messageContainKeywords(messageText, HelloKeywords)) {
        sayHello(communicationChannel);
    }
    else if (messageContainKeywords(messageText, ThankYouKeywords)) {
        sayYouAreWelcome(communicationChannel);
    }
}

// Menu provider
function serveMenu(communicationChannel) {
    Axios.get(GimmeDatAPIEndpoint).then(response => {
        
        const menuDate = response.data.menuDate.split("T")[0];
        var mealsOfTheDay = getDishList(response.data.menu.mealsOfTheDay);
        var deluxeMeals = getDishList(response.data.menu.deluxeMeals);
        var soups = getDishList(response.data.menu.soups);

        var message = 'Data menu: ';
        message += menuDate;
        message += '\n\n*Dania dnia:*';
        message += mealsOfTheDay;
        message += '\n\n*Dania deluxe:*';
        message += deluxeMeals;
        message += '\n\n*Zupy:*';
        message += soups;

        const params = {
            icon_emoji: ':curry:'
        };

        bot.postMessage(
            communicationChannel,
            `${message}`,
            params
        );
    });
}

// Show Help
function showHelp(communicationChannel) {
    bot.postMessage(
      communicationChannel,
      HelpMessage,
      DefaultParams
    );
}

// Say hello
function sayHello(communicationChannel) {
    bot.postMessage(
      communicationChannel,
      HelloMessage,
      DefaultParams
    );
}

// Say you're welcome
function sayYouAreWelcome(communicationChannel) {
    bot.postMessage(
      communicationChannel,
      YouAreWelcomeMessage,
      DefaultParams
    );
}

function getDishList(jsonList) {
    var tempList = '\n';
    tempList += jsonList.join('\n')
    return tempList;
}

function messageContainKeywords(message, keywords) {
    if(!Array.isArray(keywords)) {
        console.error(`${keywords} is not Array type!`);
        return false;
    }

    var keywordFound = false;
    keywords.some(keyword => {
        if(message.includes(keyword)) {
            keywordFound = true;
        }
    });

    return keywordFound;
}