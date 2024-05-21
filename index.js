import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";
configDotenv();

console.log("node running");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  console.log("ctx", ctx);
  await ctx.reply("Welcome to Sociobot");
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
