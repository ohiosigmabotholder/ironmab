const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TRIGGER_KEYWORD = "worldbox-smited-lightning";

const messages = [
    "no i am spooder man.",
    "I HAVE AWAKENED 🕷️",
    "you should not have done that...",
    "spooder senses activated",
    "ERROR: SPIDER MODE ENABLED",
    "you triggered ancient spooder technology"
];

// cooldown map (per channel)
const cooldowns = new Map();
const COOLDOWN_TIME = 10 * 1000; // 10 seconds

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
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