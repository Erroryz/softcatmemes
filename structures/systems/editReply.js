const { EmbedBuilder, CommandInteraction, Colors } = require("discord.js")

/**
 * @param {CommandInteraction} interaction
 * @param {String} emoji
 * @param {String} description
 */
function editReply(interaction, emoji, description) {

    interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(`\`${emoji}\` | ${description}`)
        ]
    })

}

module.exports = { editReply }