const { ActivityType } = require("discord.js");
const client = require("../../Client");

client.on("ready", async () => {
    console.log(`\n🟩 ${client.user.tag}`);

    client.user.setPresence({
        status: "idle"
    })

})