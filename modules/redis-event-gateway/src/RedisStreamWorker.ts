import { Queue } from "bullmq";
import { getRedisConnectionConfiguration} from "./RedisConfig";
import { Worker, Job } from "bullmq";
import { QueueNames } from "./Constants";
import EventQueueProcessor from "./EventQueueProcessor"; 

class RedisStreamWorker {

    private static instance: RedisStreamWorker | null = null; // Singleton instance
    protected worker: Worker;
    protected eventQueueProcessor: EventQueueProcessor; 

    private constructor(queueName: string) {

        this.eventQueueProcessor = EventQueueProcessor.getInstance(); 
        const connectionConfig = getRedisConnectionConfiguration();
        if (!connectionConfig) {
            throw new Error("Redis connection configuration is undefined");
        }
        this.worker = new Worker(
            queueName,
            this.processEvent.bind(this),
            {
                connection: connectionConfig,
                lockDuration: 50000, // Lock duration in milliseconds
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

        console.info(`Worker initialized for queue: ${queueName}`, {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
        });
       
    }

    /**
     * Returns the singleton instance of EvaluationResultWorker.
     * If the instance does not exist, it creates a new one.
     * @returns The singleton instance of EvaluationResultWorker.
     */
    public static getInstance(): RedisStreamWorker {
        if (!RedisStreamWorker.instance) {
            RedisStreamWorker.instance = new RedisStreamWorker(QueueNames.VideoTranscodingQueue);
        }
        return RedisStreamWorker.instance;
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
    protected async processEvent(job: Job): Promise<void> {
        console.info(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);
        await this.eventQueueProcessor.processEvaluationEvent(job.data.videoId);
    }
    
}   

export default RedisStreamWorker;