import serverless from "serverless-http";
import app from "../server.js";
import connectDB from "../config/db.js";

let isConnected = false;

async function ensureDBConnected() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

export const handler = async (event, context) => {
  await ensureDBConnected();
  return serverless(app)(event, context);
};

export default handler;
