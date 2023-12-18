const { EmbedBuilder, CommandInteraction, Colors } = require("discord.js")

/**
 * @param {CommandInteraction} interaction 
 * @param {String} emoji
 * @param {String} description
 * @param {Boolean} type 
 */
function reply(interaction, emoji, description, type) {

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(`\`${emoji}\` | ${description}`)
        ],
        ephemeral: type || true
    })

}

module.exports = { reply }