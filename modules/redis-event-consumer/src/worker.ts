import RedisStreamWorker from "./RedisStreamWorker";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const worker = RedisStreamWorker.getInstance();

console.info("RedisStreamWorker has started and is ready to process jobs.");
