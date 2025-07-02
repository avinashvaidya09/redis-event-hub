### Introduction

The **Redis Event Gateway** is a Node.js-based microservice designed to handle event-driven workflows using Redis as a message broker. This service provides an HTTP API to enqueue events, such as video processing jobs, into a Redis-backed queue for asynchronous processing. It is built with TypeScript and Express.

### Key Features
- **Event Queue Management**: Handles event queuing for tasks like video transcoding.
- **Redis Integration**: Utilizes Redis for efficient message brokering and stream processing.
- **REST API**: Provides a simple HTTP interface for interacting with the service.
- **TypeScript Support**: Ensures type safety and better developer experience.
- **Cloud-Ready**: Configured for deployment on SAP BTP with support for managed Redis services.

### Use Case
This service is ideal for scenarios where asynchronous processing of tasks is required, such as:
- Video transcoding
- Data processing pipelines

### Prerequisites
- Node.js and npm installed
- Redis instance (local or managed, 
    - SAP Redis Hyperscaler on BTP
    - docker image on local
- `.env` file with necessary environment variables (e.g., `PORT`, `REDIS_URL`)

### Getting Started on local
1. Install dependencies:
   ```
   npm install
   ```
2. Run `npx tsc --watch` in one terminal to convert .ts files to .js

3. Open another terminal and Start server
    ```
    npm start
    ```

4. Test the API using the provided [requests.http](requests.http) file or any HTTP client like Postman.

### Deployment to BTP
1. Ensure Redis service is entitled to your subaccount

2. Go to the root of the folder and build
```
mbt build
```

3. Deploy to cloud foundry environment
```
cf deploy mta_archives/redis-event-hub_001.mtar
```