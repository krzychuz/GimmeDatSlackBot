const SlackBot = require('slackbots');
const Axios = require('axios');
const BotData = require('./bot-data.js');
const bot = new SlackBot({
    token : BotData.getBotToken(),
    name : BotData.getBotName()
});

const DefaultSlackChannel = 'zasciankowemenuTest';
const WelcomeMessage = 'Eloszka, przygotujcie się na to, że dostaniecie dzisiejsze menu :3';
const HelpMessage = `Napisz '@zascianekbot dzisiaj' aby dostać informację o dzisiejszym menu.`;
const UnknownMessage = 'Nie rozumiem :disappointed_relieved: ';
const UnknownMessageMealQuestion =  ['Czy wiesz, że dzisiaj można zjeść ',
                                        'Może skusisz się na ',
                                        'W zamian spróbujesz może '
                                    ]
const ZascianekKeyword = 'dzisiaj';
const HelpKeyword = 'pomoc';

const GimmeDatAPIEndpoint = 'https://gimmedatapi.gear.host/api/ZascianekData';

var meals = [];

// Start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':robot_face:'
    };
    
    bot.postMessageToGroup(
        DefaultSlackChannel,
        WelcomeMessage,
        params
    );
});

// Error handler
bot.on('error', error => console.log(error));

// Message Handler
bot.on('message', data => {

    if(isUserMessage(data) === false)
    {
        return;
    }
  
    var dataText = data.text.toLowerCase();

    var result = handleMessage(dataText, data.channel);

    if(result === false)
    {
        onUnknownMessage(data.channel);
    }
  });

function onUnknownMessage(communicationChannel){
    var message = UnknownMessage;

    UnknownMessageMealQuestion.GetRandom();

    if (areMealsFetched())
    {
        message += UnknownMessageMealQuestion.GetRandom() + meals.GetRandom().toLowerCase() + '?';
    }

    sendMessage(communicationChannel, message, ':cry:');
}

//we can check here if the message has been fetched. Should be reworked
function areMealsFetched() {
    return meals.length !== 0;
}

function isUserMessage(data) {
    if(data.user === undefined || data.type === undefined)
    {
        return false;
    }

    var isMessage = data.type === 'message';
    var isUserMessage = data.user !== BotData.getBotName();

    return isMessage && isUserMessage;
}

// Message responder
function handleMessage(messageText, communicationChannel) {
    if(messageText.includes(ZascianekKeyword)) {
        serveMenu(communicationChannel);
        return true;
    }
    else if(messageText.includes(HelpKeyword)) {
        showHelp(communicationChannel);
        return true;
    }

    return false;
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

        //temporary solution
        meals = mealsOfTheDay.split("\n");
        meals = meals.filter(function(e){return e}); 

        sendMessage(communicationChannel, message, ':curry:');
    });
}

// Show Help
function showHelp(communicationChannel) {
    sendMessage(communicationChannel, HelpMessage, ':question:');
}

function sendMessage(communicationChannel, message, emoji) {
    const params = {
        icon_emoji: emoji
    };

    bot.postMessage(
        communicationChannel,
        message,
        params
    );
}

function getDishList(jsonList) {
    var tempList = '\n';
    tempList += jsonList.join('\n')
    return tempList;
}

Object.defineProperty(Array.prototype, "GetRandom", {
    value: function GetRandom() {
        return this[Math.floor(Math.random() * this.length)];
    },
    writable: true,
    configurable: true
});