import mongoose from "mongoose";
import { Types } from "telegraf";

const userSchema = mongoose.Schema(
  {
    tgId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    idBot: {
      type: Boolean,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    promptTokens: {
      type: Number,
      required: false,
    },
    completionToken: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
