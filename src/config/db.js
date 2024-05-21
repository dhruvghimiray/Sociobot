import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export default () => {
  return mongoose.connect(process.env.MONGO_CONNETION_URI);
};
