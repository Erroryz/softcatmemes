
const { ApplicationCommandOptionType } = require('discord.js');
const memesDB = require("../../database/models/memesDB");

module.exports = {
    name: 'meme',
    description: 'random cats memes',
    options: [
        {
            name: "video",
            description: "Random Cat Meme Videos",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "image",
            description: "Random Cat Meme Images",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "random",
            description: "Random Cat Memes",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {
        const { options } = interaction;
        if (options.getSubcommand() === "video") {
            const randomVideo = await memesDB.aggregate([
                { $match: { Category: "video" } }, 
                { $sample: { size: 1 } }
            ]);
            const randomLink = randomVideo[0].Link;

            await interaction.reply(randomLink)
        }
        if(options.getSubcommand() == "image") {
            const randomImage = await memesDB.aggregate([
                { $match: { Category: "image" } }, 
                { $sample: { size: 1 } }
            ]);
            const randomLink = randomImage[0].Link;

            await interaction.reply(randomLink)
        }
        if(options.getSubcommand() == "random") {
            const randomMeme = await memesDB.aggregate([
                { $sample: { size: 1 } }
            ])
            const randomLink = randomMeme[0].Link;
            await interaction.reply(randomLink)
        }

    }
}