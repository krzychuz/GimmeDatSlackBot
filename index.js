const SlackBot = require('slackbots');
const BotData = require('./bot-data.js');

const bot = new SlackBot({
    token : BotData.getBotToken(),
    name : BotData.getBotName()
});

bot.on('start', () => {
    const params = {
        icon_emoji: ':cat:'
    };
    
    bot.postMessageToGroup(
        'zasciankowemenu',
        'Eloszka, przygotujcie się na to, że dostaniecie dzisiejsze menu :3',
        params
    );
}); 