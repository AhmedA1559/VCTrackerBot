const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTime } = require("../controller/gateController");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Get the amount of time a user has been in voice chat.')
		.addUserOption(option => option.setName('target').setDescription('The user to fetch data for.')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if (!user) {
            return interaction.reply(`Your time spent: ${await getTime(interaction.user.id, interaction.guild.id)}`);
        }
		return interaction.reply(`User time spent: ${await getTime(user.id, interaction.guild.id)}`);
	},
};