const { PermissionsBitField } = require("discord.js");
const client = require("../../Client");
const { developers } = require("../../configuration/index")

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        const command = client.slashCommands.get(interaction.commandName)


        if (!command) {
            return interaction.reply({
                content: `${interaction.commandName} is not a valid command`,
                ephemeral: true,
            });
        }

        if (command.developerOnly) {
            if (!developers.includes(interaction.user.id)) {
                return interaction.reply({
                    content: `${interaction.commandName} is an exclusive command for developers`,
                    ephemeral: true,
                });
            }
        }

        if (command.userPermissions) {
            if (!interaction.channel.permissionsFor(interaction.member).has(PermissionsBitField.resolve(command.userPermissions || []))) {
                return interaction.reply({
                    content: `You do not have the necessary permissions to use this command. You need the following permissions: ${command.userPermissions.join(", ")}`,
                    ephemeral: true,
                });
            }
        }

        if (command.clientPermissions) {
            console.log(command.clientPermissions)
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.resolve(command.clientPermissions || []))) {
                return interaction.reply({
                    content: `I don't have the necessary permissions to use this command. I need the following permissions: ${command.clientPermissions.join(", ")}`,
                    ephemeral: true,
                });
            }
        }

        if (command.guildOnly && !interaction.guildId) {
            return interaction.reply({
                content: `${interaction.commandName} is an exclusive command from my creator's server`,
                ephemeral: true,
            });
        }

        await command.run(client, interaction, interaction.options);
    } catch (err) {
        console.log("\n🟥 An error occurred while processing a Slash Command: ");
        console.log(err);

        return interaction.reply({
            content: `:x: An error occurred while processing a Slash Command: ${err}`,
            ephemeral: true,
        });
    }
});