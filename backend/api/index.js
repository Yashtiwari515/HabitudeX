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

const handlerWrapper = async (event, context) => {
  await ensureDBConnected();
  const handler = serverless(app);
  return handler(event, context);
};

export const handler = handlerWrapper;
export default handlerWrapper;
