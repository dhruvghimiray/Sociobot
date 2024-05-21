import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";
import { message } from "telegraf/filters";
import dbConnect from "./src/config/db.js";
configDotenv();

import userModel from "./src/models/user.js";
import eventModel from "./src/models/event.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

try {
  dbConnect();
  console.log("database connected successfully");
} catch (error) {
  console.log(error);
  process.kill(process.pid, "SIGTERM");
}

bot.start(async (ctx) => {
  const from = ctx.update.message.from;
  console.log("from", from);

  try {
    await userModel.findOneAndUpdate(
      { tgId: from.id },
      {
        $setOnInsert: {
          firstName: from.first_name,
          lastName: from.last_name,
          idBot: from.is_bot,
          username: from.username,
        },
      },
      { upsert: true, new: true } //updates record if it already exists, if not then, creates a new one
    );

    await ctx.reply(
      "Welcome to Sociobot, I'll be writing highly engaging social media posts for you. Just keep feeding me with the events throughout the day"
    );
  } catch (err) {
    console.log(err);
    await ctx.reply("Facing Diffuculties plese try again later");
  }
});

bot.command("generate", async (ctx) => {
  const from = ctx.update.message.from;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const events = await eventModel.find({
    tgId: from.id,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (events.length === 0) {
    await ctx.reply("No events for the day! Please provide some thoughts ");
    return;
  }

  await ctx.reply("Doing some things...");
});

bot.on(message("text"), async (ctx) => {
  const from = ctx.update.message.from;
  const message = ctx.update.message.text;

  try {
    await eventModel.create({
      text: message,
      tgId: from.id,
    });
    await ctx.reply(
      "Noted! Keep telling me thoughts and if you feel like it's enough, use /generate to create a post"
    );
  } catch (error) {
    console.log(error);
    await ctx.reply("Facing diffuculties please try again later");
  }
});



bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
