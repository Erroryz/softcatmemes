const axios = require("axios");
const randomCatEmoji = require("../../systems/randomCatEmoji")
const apiUrl = 'https://api.thecatapi.com/v1/images/search';

module.exports = {
    name: 'meowimage',
    description: 'Random images of beautiful cats',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {
        const { options } = interaction;
        let catData;
        await axios.get(apiUrl, {
            headers: {
              'x-api-key': 'live_kVxhBP4M9adZcTf0CxgMluRSBW27E1qraU8yLyLzp40SsU0U016B1rfiKZ5fSZIE',
            },
          })
            .then(async response => {
              catData = response.data[0].url;
            })
            .catch(error => {
              console.error('Error fetching cat data:', error);
            });
            await interaction.reply({content: catData, ephemeral: false})
    }
}