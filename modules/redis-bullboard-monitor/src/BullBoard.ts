import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bullmq";
import express from "express";
import { QueueNames } from "../../redis-config/Constants"; // Adjust the import path as necessary
import { getRedisConnectionConfiguration } from "../../redis-config/RedisConnectionConfig"; // Adjust the import path as necessary
import dotenv from "dotenv";

class BullBoard {
    
    private app: express.Application;
    private serverAdapter: ExpressAdapter;
    private redisConnectionConfig: any;
  
    constructor() {
      this.app = express();
      this.serverAdapter = new ExpressAdapter();
      this.redisConnectionConfig = getRedisConnectionConfiguration();
    }
  
    /**
     * Creates a BullMQ queue with the specified name.
     * @param queueName - The name of the queue to create.
     * @returns A new BullMQ Queue instance.
     */
    private _createQueue(queueName: string): Queue {
      return new Queue(queueName, {
        connection: this.redisConnectionConfig,
      });
    }
  
    /**
     * Sets up Bull Board with the specified queues and server adapter.
     * This method initializes the Bull Board interface and mounts it on the Express app.
     */
    private _setupBullBoard(): void {
      const videoTranscodingQueue = this._createQueue(QueueNames.VideoTranscodingQueue);
  
      createBullBoard({
        queues: [
          new BullMQAdapter(videoTranscodingQueue)
        ],
        serverAdapter: this.serverAdapter,
      });
  
      this.serverAdapter.setBasePath("/admin/queues");
      this.app.use("/admin/queues", this.serverAdapter.getRouter());
    }
  
    /**
     * Starts the Express server and sets up Bull Board.
     * @param port - The port on which the server will listen.
     */
    public startServer(port: number): void {
      this._setupBullBoard();
      this.app.listen(port, () => {
        console.log(`App running on port ${port}`);
      });
    }
  }
  
  // Instantiate and start the server
  dotenv.config();
const port = Number(process.env.PORT) || 3000; // Default port if not specified in .env
  const bullBoard = new BullBoard();
  bullBoard.startServer(port);