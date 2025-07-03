import { Queue } from "bullmq";
import { getRedisConnectionConfiguration } from "../../redis-config/RedisConnectionConfig"; // Adjust the import path as necessary
import { Worker, Job } from "bullmq";
import { QueueNames } from "../../redis-config/Constants"; // Adjust the import path as necessary
import EventQueueProcessor from "./EventQueueProcessor"; 

class RedisStreamWorker {

    protected worker: Worker;
    protected eventQueueProcessor: EventQueueProcessor; 

    public constructor(consumerName: string, queueName: string) {

        this.eventQueueProcessor = EventQueueProcessor.getInstance(); 
        const connectionConfig = getRedisConnectionConfiguration();
        if (!connectionConfig) {
            throw new Error("Redis connection configuration is undefined");
        }
        this.worker = new Worker(
            queueName,
            async (job: Job) => {
                await this.processEvent(job, consumerName)
            },
            {
                connection: connectionConfig,
                lockDuration: 50000, // Lock duration in milliseconds
                concurrency: 2, // Each worker can process up to 5 jobs concurrently
            }
        );

        this.worker.on("completed", (job) => this.onJobCompleted(job));

        this.worker.on("failed", (job, err) => {
            if (job) {
                this.onJobFailed(job, err);
            } else {
                console.error(`Failed job is undefined. Error: ${err.message}`);
            }
        });

        console.info(`${consumerName} initialized for queue: ${queueName} on Redis at ${connectionConfig.host}:${connectionConfig.port}`);
       
    }


    /**
     * Handles job completion. This method should be implemented by child classes.
     * @param job - The completed job.
     */
    protected async onJobCompleted(job: Job): Promise<void> {
        console.info(`Job ${job.id} completed successfully`);
        // Additional logic for job completion can be added here
    }

    /**
     * Handles job failure. This method should be implemented by child classes.
     * @param job - The failed job.
     * @param err - The error that caused the failure.
     */
    protected async onJobFailed(job: Job, err: Error): Promise<void> {
        console.error(`Job ${job.id} failed with error: ${err.message}`);
        // Additional logic for job failure can be added here
    }


    /**
     * Processes a job from the queue.
     * @param job - The job to be processed.
     */
    protected async processEvent(job: Job, consumerName: string): Promise<void> {
        console.info(`${consumerName} processing job ${job.id} with data: ${JSON.stringify(job.data, null, 2)}`);
        await this.eventQueueProcessor.processEvaluationEvent(job.data);
    }
    
}   

export default RedisStreamWorker;