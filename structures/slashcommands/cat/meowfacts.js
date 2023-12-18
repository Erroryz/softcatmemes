const axios = require("axios");
const randomCatEmoji = require("../../systems/randomCatEmoji")

module.exports = {
    name: 'meowfacts',
    description: 'Random facts about cats',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {
        const url = "https://meowfacts.herokuapp.com/";    
        const fact = await axios.get(url);
        await interaction.reply(`${randomCatEmoji()} ${fact.data.data[0]}`)
    }
}