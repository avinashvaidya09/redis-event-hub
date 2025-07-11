import { Queue } from "bullmq";
import { getRedisConnectionConfiguration } from "../../redis-config/RedisConnectionConfig"; // Adjust the import path as necessary

class RedisStreamQueue {    

    private static instance: RedisStreamQueue | null = null; // Singleton instance
    protected queue: Queue | null = null; // The queue instance

    private constructor(queueName: string) {
        this._initializeQueue(queueName);
    }

    /**
     * Initializes the queue with Redis connection settings.
     * This method is called in the constructor to set up the queue.
     * @param queueName - The name of the queue to be initialized.
     */
    private async _initializeQueue(queueName: string): Promise<void> {
        const connectionConfig = getRedisConnectionConfiguration();
        if (!connectionConfig) {
            throw new Error("Redis connection configuration is undefined");
        }
        this.queue = new Queue(queueName, {
            connection: connectionConfig,
        });

        console.info(`${queueName} initialized successfully with configured Redis connection: ${connectionConfig.host}:${connectionConfig.port}`);
    }

    /**
     * Adds a message to the queue.
     * @param jobName - The name of the job to be added.
     * @param data - The data to be added to the queue.
     * @param options - Additional options for the queue.
     */
    public async sendEvent(jobName: string, data: Record<string, any>, options: object = {}): Promise<void> {
        try {
            if (!this.queue) {
                throw new Error("Queue is not initialized");
            }
            await this.queue.add(jobName, data, options);
            console.info(`Message added to ${this.queue.name} queue, ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            console.error(`Error adding message to ${this.queue?.name || 'unknown'} queue, ${JSON.stringify(error)}`);
            throw error;
        }
    }


    /**
     * Retrieves the current queue instance.
     * @returns The current queue instance.
     */
    public getQueue(): Queue {
        if (!this.queue) {
            throw new Error("Queue is not initialized");
        }
        return this.queue;
    }   

    public static getInstance(queueName: string): RedisStreamQueue {
        if (!RedisStreamQueue.instance) {
            RedisStreamQueue.instance = new RedisStreamQueue(queueName);
        }
        return RedisStreamQueue.instance;
    }


}

export default RedisStreamQueue;