import express from "express";
import dotenv from "dotenv";
import EventQueueService from "./EventQueueService";
import { JobNames } from "../../redis-config/Constants";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON payloads
app.use(express.json());

// Get EventQueueService instance
const eventQueueService = EventQueueService.getInstance();
// Initiate RedisStreamWorker instance to start processing jobs

// POST endpoint to handle videoId
app.post("/video", (req: any, res: any) => {

  const input = req.body;

  if (!input) {
    return res.status(400).json({ error: "Payload is required" });
  }

  try {
    const success = eventQueueService.sendEventToQueue(JobNames.VideoTranscodingJob, input);

    if (!success) {
      return res
        .status(400)
        .json({ error: "Failed to send videoId to the queue" });
    }
    res.status(200).json({ message: `Received videoId: ${input.videoId}` });
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
