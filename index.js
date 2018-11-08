const SlackBot = require('slackbots');
const Axios = require('axios');
const BotData = require('./bot-data.js');

const bot = new SlackBot({
    token : BotData.getBotToken(),
    name : BotData.getBotName()
});

const SlackChannel = 'zasciankowemenu';
const WelcomeMessage = 'Eloszka, przygotujcie się na to, że dostaniecie dzisiejsze menu :3';
const HelpMessage = `Napisz '@zascianekbot dzisiaj' aby dostać informację o dzisiejszym menu.`;
const ZascianekKeyword = 'dzisiaj';
const HelpKeyword = 'pomoc';

const GimmeDatAPIEndpoint = 'http://localhost:51916/api/ZascianekData';

// Start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':robot_face:'
    };
    
    bot.postMessageToGroup(
        SlackChannel,
        WelcomeMessage,
        params
    );
});

// Error handler
bot.on('error', error => console.log(error));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message') {
        return;
    }
  
    handleMessage(data.text);
  });

// Message responder
function handleMessage(messageText) {
    if(messageText.includes(ZascianekKeyword)) {
        serveMenu();
    }
    else if(messageText.includes(HelpKeyword)) {
        showHelp();
    }
}

// Menu provider
function serveMenu() {
    Axios.get(GimmeDatAPIEndpoint).then(response => {
        
        const menuDate = response.data.menuDate.split("T")[0];
        var mealsOfTheDay = getDishList(response.data.menu.mealsOfTheDay);
        var deluxeMeals = getDishList(response.data.menu.deluxeMeals);
        var soups = getDishList(response.data.menu.soups);

        var message = menuDate;
        message += '\n\n*Dania dnia:*';
        message += mealsOfTheDay;
        message += '\n\n*Dania deluxe:*';
        message += deluxeMeals;
        message += '\n\n*Zupy:*';
        message += soups;

        const params = {
            icon_emoji: ':curry:'
        };

        bot.postMessageToGroup(
            SlackChannel,
            `Data menu: ${message}`,
            params
        );
    });
}

// Show Help
function showHelp() {
    const params = {
      icon_emoji: ':question:'
    };
  
    bot.postMessageToGroup(
      SlackChannel,
      HelpMessage,
      params
    );
}

function getDishList(jsonList) {
    var tempList = '\n';
    tempList += jsonList.join('\n')
    return tempList;
}