const { readdirSync } = require("fs");
const { REST, Routes, Client, Collection, EmbedBuilder, Colors } = require('discord.js');
const { clientId, clientToken, logsError, database } = require("./configuration/index");

const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "MessageContent",
        "GuildVoiceStates",
        "GuildModeration",
        "GuildEmojisAndStickers",
        "GuildIntegrations",
        "GuildWebhooks",
        "GuildInvites",
        "GuildPresences",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "DirectMessages",
        "DirectMessageReactions",
        "DirectMessageTyping"
    ],
    partials: [
        "Channel",
        "Message",
        "Reaction"
    ]
});

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();

module.exports = client;

if (database) {
    require("./database/connect").connect()
}

(async () => {
    await loadCommands();
    await loadEvents();
    await loadSlashCommands();
    await catchErrors();
})()

client.login(clientToken).catch((error) => {
    console.log("\n🟥 Unable to log in to the bot. Please check the configuration file.")
    console.log(error)
    return process.exit()
})


async function loadCommands() {
    console.log("🟦 Loading Commands...")

    readdirSync('./structures/commands/').forEach(dir => {
        const commands = readdirSync(`./structures/commands/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of commands) {
            const pull = require(`./commands/${dir}/${file}`);

            try {
                if (!pull.name || !pull.description) {
                    console.log(`🟥 Unable to load command ${file}, error: missing name, description or function`)
                    continue;
                }

                pull.category = dir;
                client.commands.set(pull.name, pull);

                console.log(`🟩 Loaded command: ${pull.name}`);
            } catch (err) {
                console.log(`🟥 Unable to load command ${file}, error: ${err}`)
                continue;
            }


            if (pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
            }
        }
    })
}

async function loadEvents() {
    console.log("\n🟦 Loading events...")

    readdirSync('./structures/events/').forEach(async (dir) => {
        const events = readdirSync(`./structures/events/${dir}`).filter((file) => file.endsWith(".js"));

        for (const file of events) {
            const pull = require(`./events/${dir}/${file}`);

            try {
                if (pull.name && typeof pull.name !== 'string') {
                    console.log(`🟥 Unable to load lavalink event ${file}, error: property event should be string.`)
                    continue;
                }

                pull.name = pull.name || file.replace('.js', '');

                console.log(`🟩 Event loaded: ${pull.name}`);
            } catch (err) {
                console.log(`🟥 Unable to load event ${file}, error: ${err}`)
                continue;
            }
        }
    });
}

async function loadSlashCommands() {
    console.log("\n🟦 Loading Slash Commands...")
    const slash = [];

    readdirSync('./structures/slashcommands/').forEach(async (dir) => {
        const commands = readdirSync(`./structures/slashcommands/${dir}`).filter((file) => file.endsWith(".js"));

        for (const file of commands) {
            const pull = require(`./slashcommands/${dir}/${file}`);

            try {
                if (!pull.name || !pull.description) {
                    console.log(`🟥 Unable to load Slash Commands ${file}, error: missing name, description or function.`)
                    continue;
                }

                const data = {};
                for (const key in pull) {
                    data[key.toLowerCase()] = pull[key];
                }

                slash.push(data);

                pull.category = dir;
                client.slashCommands.set(pull.name, pull);

                console.log(`🟩 Slash Command loaded: ${pull.name}`);
            } catch (err) {
                console.log(`🟥 Unable to load Slash Commands ${file}, error: ${err}`)
                continue;
            }
        }
    })

    if (!clientId) {
        console.log("🟥 Unable to find clientID in configuration file")
        return process.exit()
    }

    const rest = new REST({ version: '10' }).setToken(clientToken);

    try {
        await rest.put(Routes.applicationCommands(clientId), { body: slash }).then(() => {
            console.log("\n🟩 Application commands registered successfully.")
        })
    } catch (error) {
        console.log("\n🟥 Unable to register application commands.")
        console.log(error);
    }
}

function catchErrors() {

    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTimestamp()

    const logsChannelId = logsError

    process
        .on("uncaughtException", async (err) => {

            console.log(`\n🟥 Uncaught Exception : ${err}`)

            client.channels.fetch(logsChannelId).then(channel => {

                if (!channel) return

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Uncaught Exception/Catch")
                            .setDescription([
                                "```" + err.stack + "```"
                            ].join("\n"))
                    ]
                })

            }).catch(err => { return })

        })
        .on("uncaughtExceptionMonitor", async (err) => {

            console.log(`\n🟥 Uncaught Exception (Monitor) : ${err}`)

            client.channels.fetch(logsChannelId).then(channel => {

                if (!channel) return

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Uncaught Exception/Catch (MONITOR)")
                            .setDescription([
                                "```" + err.stack + "```"
                            ].join("\n"))
                    ]
                })

            }).catch(err => { return })

        })
        .on("unhandledRejection", async (reason) => {

            console.log(`\n🟥 Unhandled Rejection/Catch : ${reason}`)

            client.channels.fetch(logsChannelId).then(channel => {

                if (!channel) return

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Unhandled Rejection/Catch")
                            .setDescription([
                                "```" + reason.stack + "```"
                            ].join("\n"))
                    ]
                })

            }).catch(err => { return })

        })

}