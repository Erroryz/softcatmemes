const { EmbedBuilder } = require("discord.js");
const client = require("../../Client");
const ms = require("ms");
const DB = require("../../database/models/upload");
const memesDB = require("../../database/models/memesDB");


client.on("interactionCreate", async (interaction) => {

     /**
     * @param {ButtonInteraction} interaction
     */

    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith(`submit-`)) return;



    if(interaction.customId == "submit-link") {
        const data = await DB.findOne({
            MessageID: interaction.message.id,
        });

        await interaction.reply({ content: data.Link, ephemeral: true})
    }

    const embedColor = interaction.customId === "submit-approve" ? 0x00FF00 : 0xFF0000;


    if(interaction.customId == "submit-approve") {

        const data = await DB.findOne({
            MessageID: interaction.message.id,
        });
        
        await memesDB.create({
            Link: data.Link,
            Category: data.Category,
        })

        await DB.deleteOne({
            MessageID: interaction.message.id,
        });

        const updatedComponents = interaction.message.components.map(actionRow => {
            return {
                type: actionRow.type,
                components: actionRow.components.map(button => {
                    button.data.disabled = true;
                    return button.data;
                }),
            };
        });

        const updatedEmbed = new EmbedBuilder(interaction.message.embeds[0])
            .setColor(embedColor);

        interaction.message.edit({
            components: updatedComponents,
            embeds: [updatedEmbed]
        });
        
        interaction.deferUpdate();
    }
    if(interaction.customId == "submit-deny") {
        await DB.deleteOne({
            MessageID: interaction.message.id,
        });
        const updatedComponents = interaction.message.components.map(actionRow => {
            return {
                type: actionRow.type,
                components: actionRow.components.map(button => {
                    
                    button.data.disabled = true;
                    return button.data;
                }),
            };
        });
        const updatedEmbed = new EmbedBuilder(interaction.message.embeds[0])
        .setColor(embedColor);
        interaction.message.edit({
            components: updatedComponents,
            embeds: [updatedEmbed],
        });
        interaction.deferUpdate()
    
    }

});