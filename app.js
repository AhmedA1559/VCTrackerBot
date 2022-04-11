const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const { token } = require("./config.json");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});
bot.commands = new Collection();

async function main() {
  // setup commands 
  fs.readdirSync('./app/command').filter(file => file.endsWith('.js')).forEach( (file) => {
    const command = require(`./app/command/${file}`);
    bot.commands.set(command.data.name, command);
  });

  // setup events
  fs.readdirSync('./app/event').filter(file => file.endsWith('.js')).forEach( (file) => {
    bot.on(file.split('.')[0], require(`./app/event/${file}`));
  });

  bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const command = bot.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });

  mongoose.connect("");

  await bot.login("");
}

main().catch((err) => console.log(err));
