const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

// ---------------- EXPRESS (fixes Render Web Service port issue) ----------------
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is alive");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TRIGGER_KEYWORD = "https://tenor.com/view/worldbox-smited-lightning-gif-17816464421779196148";

const messages = [
    "no i am ironmab man.",
    "holy are these my real hands or just my schizophrenia?",
    "man i dont like these damn guns",
    "mamo-nashines activatood",
    "ay mab why are hue sad?",
    "@Spooderman (Clone)#7304  is corny"
];

// cooldown map (per channel)
const cooldowns = new Map();
const COOLDOWN_TIME = 10 * 1000; // 10 seconds

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

    setInterval(async () => {
        // 10% chance every 10 seconds
        if (Math.random() > 0.1) return;

        try {
            const channels = [];

            for (const guild of client.guilds.cache.values()) {
                for (const channel of guild.channels.cache.values()) {
                    if (
                        channel.isTextBased() &&
                        channel.permissionsFor(guild.members.me)?.has([
                            "ViewChannel",
                            "SendMessages"
                        ])
                    ) {
                        channels.push(channel);
                    }
                }
            }

            if (channels.length === 0) return;

            const randomChannel =
                channels[Math.floor(Math.random() * channels.length)];

            const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];

            await randomChannel.send(randomMessage);

            console.log(
                `Sent "${randomMessage}" in #${randomChannel.name}`
            );
        } catch (err) {
            console.error("Random message error:", err);
        }
    }, 10000); // every 10 seconds
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // check trigger
    if (!message.content.includes(TRIGGER_KEYWORD)) return;

    const now = Date.now();
    const lastUsed = cooldowns.get(message.channel.id);

    // cooldown check
    if (lastUsed && now - lastUsed < COOLDOWN_TIME) return;

    cooldowns.set(message.channel.id, now);

    // pick random message
    const reply = messages[Math.floor(Math.random() * messages.length)];

    await message.channel.send(reply);
});

client.login(process.env.TOKEN);
