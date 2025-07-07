import dotenv from "dotenv";
dotenv.config();

import express from "express";
import EventQueueService from "./EventQueueService";
import { JobNames } from "../../redis-config/Constants";
import { setFeatureFlag, getFeatureFlag } from "./FeatureFlagService";

;
const app = express();
const port = process.env.PORT || 8080;
const IS_EDA_ENABLED_FEATURE_FLAG_KEY = "IS_EDA_ENABLED";

// Middleware to parse JSON payloads
app.use(express.json());

// Get EventQueueService instance
const eventQueueService = EventQueueService.getInstance();
// Initiate RedisStreamWorker instance to start processing jobs

// POST endpoint to handle videoId
app.post("/video", async (req: any, res: any) => {

  const input = req.body;

  if (!input) {
    return res.status(400).json({ error: "Payload is required" });
  }

  const isEdaEnabled = await getFeatureFlag(IS_EDA_ENABLED_FEATURE_FLAG_KEY);
  if (!isEdaEnabled) {
    return res.status(503).json({
      error: "EDA is not enabled. Please enable the feature flag to use this endpoint."
    });
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

app.post("/feature-flag/:key", async (req: any, res: any) => {
  const { key } = req.params;
  const { value } = req.body;

  if (typeof value !== "boolean") {
    return res.status(400).json({ error: "Value must be a boolean" });
  }

  try {
    const success = await setFeatureFlag(key, value);
    if (!success) {
      return res.status(500).json({ error: "Failed to set feature flag" });
    }
    res.status(200).json({ message: `Feature flag ${key} set to ${value}` });
  } catch (error) {
    console.error(`Error setting feature flag ${key}:`, error);
    return res.status(500).json({ error: "Failed to set feature flag" });
  }
});

app.get("/feature-flag/:key", async (req: any, res: any) => {
  const { key } = req.params;
  try {
    const value = await getFeatureFlag(key);
    res.status(200).json({ key, value });
  } catch (error) {
    console.error(`Error getting feature flag ${key}:`, error);
    return res.status(500).json({ error: "Failed to get feature flag" });
  }
});

// Start the server
app.listen(port, () => {
	console.log('%s listening at %s', app.name, port);
})
