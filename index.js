import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // メンションされた時だけ反応
  if (!msg.mentions.has(client.user)) return;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたはDiscordの参謀AIです。必ず結論から述べて、簡潔で論理的に説明してください。",
        },
        { role: "user", content: msg.content.replace(`<@${client.user.id}>`, "").trim() }
      ],
    });

    const reply = completion.choices[0].message.content;
    msg.reply(reply);
  } catch (e) {
    console.error(e);
    msg.reply("エラーが発生しました。");
  }
});

client.login(process.env.DISCORD_TOKEN);
