import express from "express";
import dotenv from "dotenv";
import EventQueueService from "./EventQueueService";
import { JobNames } from "../../config/Constants";
import RedisStreamWorker from "./RedisStreamWorker";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON payloads
app.use(express.json());

// Get EventQueueService instance
const eventQueueService = EventQueueService.getInstance();
// Initiate RedisStreamWorker instance to start processing jobs
RedisStreamWorker.getInstance();

// POST endpoint to handle videoId
app.post("/video", (req: any, res: any) => {

  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: "videoId is required" });
  }

  try {
    const success = eventQueueService.sendEventToQueue(JobNames.VideoTranscodingJob ,videoId);

    if (!success) {
      return res
        .status(400)
        .json({ error: "Failed to send videoId to the queue" });
    }
    res.status(200).json({ message: `Received videoId: ${videoId}` });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error sending videoId to the queue: ${error.message}`);
    } else {
      console.error("Error sending videoId to the queue: Unknown error");
    }
    return res.status(400).json({ error: "Failed to send videoId to the queue" });
  }
});

// Start the server
app.listen(port, () => {
	console.log('%s listening at %s', app.name, port);
})
