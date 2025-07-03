import { QueueNames } from "../../redis-config/Constants";
import RedisStreamWorker from "./RedisStreamWorker";
import dotenv from "dotenv";
import express from "express";
// Load environment variables from .env file
dotenv.config();
const workerCount = Number(process.env.WORKER_COUNT) || 2; // Default to 2 if not set

for (let i = 1; i <= workerCount; i++) {
    new RedisStreamWorker(
        `RedisStreamWorker-${i}`,
        QueueNames.VideoTranscodingQueue
    );

    console.info(`RedisStreamWorker-${i} has started and is ready to process jobs.`);
}

const app = express();
const port = process.env.PORT || 8080;

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});



app.listen(port, () => {
    console.info(`Health check server is running on port ${port}`);
});

