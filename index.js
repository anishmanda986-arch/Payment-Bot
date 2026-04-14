require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 🤖 BOT READY
client.once("ready", () => {
  console.log("Bot online:", client.user.tag);
});

// 💳 CRAFTINGSTORE WEBHOOK
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("Payment received:", data);

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = await guild.members.fetch(data.discord_id);

    let roleName = "";

    if (data.package_name.includes("VIP")) roleName = "VIP";
    if (data.package_name.includes("MVP")) roleName = "MVP";

    const role = guild.roles.cache.find(r => r.name === roleName);

    if (role) {
      await member.roles.add(role);
    }

    console.log("Role given:", roleName);

    res.send("OK");
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

// 🌐 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running ✔");
});

// 🚀 START SERVER
app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});

// 🤖 LOGIN
client.login(process.env.TOKEN);