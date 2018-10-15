const SlackBot = require('slackbots');
const Axios = require('axios');
const BotData = require('./bot-data.js');

const bot = new SlackBot({
    token : BotData.getBotToken(),
    name : BotData.getBotName()
});

const SlackChannel = 'zasciankowemenu';
const WelcomeMessage = 'Eloszka, przygotujcie się na to, że dostaniecie dzisiejsze menu :3';
const HelpMessage = `Napisz '@zascianekbot menu' aby dostać informację o dzisiejszym menu.`;

// Start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':cat:'
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
    console.log(data);
  });

// Message responder
function handleMessage(messageText) {
    if(messageText.includes(' menu')) {
        serveMenu();
    }
    if(messageText.includes(' chucknorris')) {
        tellChuckNorrisJoke();
    }
    else if(messageText.includes(' pomoc')) {
        showHelp();
    }
}

// Menu provider
function serveMenu() {
    Axios.get('https://gimmedatapi.gear.host/api/ZascianekData').then(response => {
        const menuDate = response.data.value.menuDate;

        const params = {
            icon_emoji: ':date:'
        };

        bot.postMessageToGroup(
            SlackChannel,
            `Data menu: ${menuDate}`,
            params
        );
    });
}

// Chuck Norris Jokes
function tellChuckNorrisJoke() {
  Axios.get('http://api.icndb.com/jokes/random').then(res => {
    const joke = res.data.value.joke;

    const params = {
      icon_emoji: ':laughing:'
    };

    bot.postMessageToGroup(
        SlackChannel,
        `Chuck Norris: ${joke}`,
        params);
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