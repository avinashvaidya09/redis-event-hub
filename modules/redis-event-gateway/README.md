### Introduction

The **Redis Event Gateway** is a Node.js-based microservice designed to handle event-driven workflows using Redis as a message broker. This service provides an HTTP API to enqueue events, such as video processing jobs, into a Redis-backed queue for asynchronous processing.

### Key Features
- **Event Queue Management**: Handles event queuing for tasks like video transcoding.
- **Redis Integration**: Utilizes Redis for efficient message brokering and stream processing.
- **REST API**: Provides a simple HTTP interface for interacting with the service.
- **TypeScript Support**: Ensures type safety and better developer experience.
- **Cloud-Ready**: Configured for deployment on SAP BTP with support for managed Redis services.

### Use Case
This service is ideal for scenarios where asynchronous processing of tasks is required, such as:
- Video transcoding
- Asynchronous feed generation
- Data processing pipelines

### Prerequisites for local set up
- Node.js and npm installed
- Redis instance (local): docker image on local. I am using docker desktop. 
```
docker run --name local-redis -p 6379:6379 -d redis
```
- Start redis container
- `.env` file with necessary environment variables (e.g., `PORT`, `REDIS_URL`)

### Getting Started on local
1. Open terminal and go to the `redis-event-gateway` directory

2. Install dependencies:
   ```
   npm install
   ```
3. Run `npx tsc --watch` in the terminal to convert .ts files to .js

4. Open another terminal and go to the `redis-event-gateway` directory and start server
    ```
    npm start
    ```

5. Test the API using the provided [requests.http](requests.http) file or any HTTP client like Postman.

6. Execute the requests. You should see below error message
    ```JSON
    {
        "error": "EDA is not enabled. Please enable the feature flag to use this endpoint."
    }
    ```
   You have to toggle this flag to `true` using the request provided in [requests.http](requests.http)
   and then execute `http://localhost:8080/transcode/video`

7. You should see the below log in the console
    ```JSON
    Message added to video-transcoding-queue, PAYLOAD: {
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

8. Now go to the [README.md](../redis-bullboard-monitor/README.md) file of `redis-bullboard-monitor` project.


