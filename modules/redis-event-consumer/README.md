### Introduction

This module is responsible for consuming and processing jobs from BullMQ queues (such as `video-transcoding-queue`) in the Redis Event Hub platform.

### Key Features

- Consumes jobs from Redis-backed BullMQ queues
- Supports dynamic worker scaling via configuration
- Handles job completion and failure with customizable hooks
- Easily extendable for additional job types


### Pre-requisites for local set up

- Node.js and npm installed
- `.env` file with necessary environment variables (e.g., `PORT`, `REDIS_URL`)
- Redis instance (local): docker image on local. I am using docker desktop. 

### Getting Started on local
1. Open terminal and go to the `redis-event-consumer` directory

2. Install dependencies:
   ```
   npm install
   ```
3. Run `npx tsc --watch` in the terminal to convert .ts files to .js

4. Open another terminal and go to the `redis-event-consumer` directory and start server
    ```
    npm start
    ```
5. The number of worker instances is controlled by the WORKER_COUNT environment variable.

6. Each worker will process jobs from the configured queue(s) concurrently.

7. Logs will indicate when jobs are picked up, completed, or failed. Refer below sample logs
```JSON
EventQueueProcessor initialized
RedisStreamWorker-1 initialized for queue: video-transcoding-queue on Redis at localhost:6379
RedisStreamWorker-1 has started and is ready to process jobs.
RedisStreamWorker-2 initialized for queue: video-transcoding-queue on Redis at localhost:6379
RedisStreamWorker-2 has started and is ready to process jobs.
Health check server is running on port 8081
RedisStreamWorker-1 processing job 1 with data: {
  "videoId": "12345-11",
  "title": "Sample Video",
  "description": "This is a sample video for testing purposes.",
  "s3Location": "s3://my-bucket/videos/12345.mp4",
  "transcodingTypes": [
    "1080p",
    "720p",
    "480p"
  ],
  "format": "mp4",
  "resolution": "1080p",
  "duration": 120,
  "uploadedBy": "user123",
  "uploadDate": "2025-07-03T10:00:00Z"
}
Processing video transcoding for videoId: 12345-11
RedisStreamWorker-1 processing job 3 with data: {
  "videoId": "12345-11",
  "title": "Sample Video",
  "description": "This is a sample video for testing purposes.",
  "s3Location": "s3://my-bucket/videos/12345.mp4",
  "transcodingTypes": [
    "1080p",
    "720p",
    "480p"
  ],
  "format": "mp4",
  "resolution": "1080p",
  "duration": 120,
  "uploadedBy": "user123",
  "uploadDate": "2025-07-03T10:00:00Z"
}
```

### Notes
- Ensure your Redis connection details match those used by your BullMQ producers and BullBoard monitor.
- For production deployments, monitor worker logs.