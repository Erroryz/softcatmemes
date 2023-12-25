
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { databaseChannel, uploadChannel} = require('../../configuration/index.js')
const { ApplicationCommandOptionType, Colors } = require('discord.js');
const DB = require("../../database/models/upload");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
 
module.exports = {
    name: 'upload',
    description: 'Upload memes/videos/images',
    options: [
        {
            name: "type",
            description: "Type",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Video', value: 'video'},
                { name: "Image", value: "image"},
            ]
            
        },
        {
            name: "upload",
            description: "Upload the file",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },

        
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
            const category = interaction.options.getString('type');

            const upload = interaction.options.getAttachment("upload");

            if (category === 'image') {
                const allowedImageFormats = ['png', 'jpg', 'jpeg', 'gif']; 
                const fileExtension = upload.name.split('.').pop().toLowerCase();
        
                if (!allowedImageFormats.includes(fileExtension)) {
                    return interaction.reply({ content: 'Invalid image format. Please send a PNG, JPG, JPEG or GIF file.', ephemeral: true});
                }
            }
            if (category === 'video') {
                const allowedVideoFormats = ['mp4', 'avi', 'mov'];
                const fileExtension = upload.name.split('.').pop().toLowerCase();
        
                if (!allowedVideoFormats.includes(fileExtension)) {
                    return interaction.reply({ content: 'Invalid video format. Please upload an MP4, AVI, MOV or other supported format.', ephemeral: true});
                }
            }


            const confirm = new EmbedBuilder()
            .setTitle("<:1418magnifyingglasscat:1184975853927534642> Are you sure?")
            .setColor(Colors.White)
            .setDescription(`\`\`\`diff\n- some rules here bla bla bla\`\`\`\n \`\`\`${upload.url}\`\`\``)

            if(category == 'image') confirm.setImage(upload.url)

            const confirmation = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("submit-confirm")
                    .setEmoji({ name: "3464thumbsupcat", id: "1184976062262804611" })
                    .setStyle(3)
                    .setDisabled(false)
                    .setLabel("Confirm"),
                    new ButtonBuilder()
                    .setCustomId("submit-cancel")
                    .setEmoji({ name: "catcry", id: "1184978805283115109" })
                    .setStyle("Danger")
                    .setDisabled(false)
                    .setLabel("Cancel")
            );
            
            const submitButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("submit-approve")
                    .setEmoji({ name: "3464thumbsupcat", id: "1184976062262804611" })
                    .setStyle(3)
                    .setDisabled(false)
                    .setLabel("Approve"),
                new ButtonBuilder()
                    .setCustomId("submit-deny")
                    .setEmoji({ name: "8586thumbsdowncat", id: "1184989954699436113" })
                    .setStyle("Danger")
                    .setDisabled(false)
                    .setLabel("Deny"),
                new ButtonBuilder()
                    .setCustomId("submit-link")
                    .setEmoji({ name: "link", id: "1185946846955319338" })
                    .setStyle(2)
                    .setDisabled(false)
                    .setLabel("Send Link"),             
            );
            await interaction.reply({  embeds: [confirm], components: [confirmation], ephemeral: true });
            
            const collector = interaction.channel.createMessageComponentCollector({
                filter: (i) =>
                i.isButton() &&
                i.customId.startsWith(`submit-`),                 
                time: 3600000,
              });
    
              collector.on('collect', async (buttonInteraction) => {
                switch (buttonInteraction.customId) {
                    case "submit-confirm": 
                        await buttonInteraction.reply({ content: "<:5030callmecat:1184982146067214336> Upload confirmed!", ephemeral: true});
                        setTimeout(() => {
                            interaction.deleteReply()
                            buttonInteraction.deleteReply()
                        }, 5000);
                        
                            
                        const downloadPath = path.join(__dirname, 'downloads', upload.name);

                        const response = await axios({
                            method: 'get',
                            url: upload.url,
                            responseType: 'stream',
                        });
                        response.data.pipe(fs.createWriteStream(downloadPath));
                        await new Promise((resolve) => {
                            response.data.on('end', resolve);
                        });

                        let channelUpload = await client.channels.fetch(databaseChannel)
                        const messageUpload = await channelUpload.send({
                            files: [downloadPath],
                        });
                        
                        const submit = new EmbedBuilder()
                        .setTitle(`Upload by ${interaction.user.username} (${interaction.user.id})`)
                        .setDescription(`\n\`\`\`${messageUpload.attachments.first().url}\`\`\``)
                        .setURL(upload.url)
                        .setColor(Colors.White)

                        if(category == 'image') submit.setImage(messageUpload.attachments.first().url)

                        let channel = await client.channels.fetch(uploadChannel)
                        const message = await channel.send({
                            content: `${messageUpload.attachments.first().url}`,
                            components: [submitButton],
                            embeds: [submit]
                        })
                        collector.stop();

                        await DB.create({
                            MessageID: message.id,
                            Link: messageUpload.attachments.first().url,
                            Category: category,
                        })
                        fs.unlinkSync(downloadPath);

                    break;
                    case "submit-cancel":
                        interaction.deleteReply()
                        collector.stop();
                    break;
                }
            })
    }
}
