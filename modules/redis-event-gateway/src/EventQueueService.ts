import { JobNames, QueueNames } from "../../redis-config/Constants"; // Adjust the import path as necessary
import RedisStreamQueue from "./RedisStreamQueue";

class EventQueueService {

    // Singleton instance
    private static instance: EventQueueService | null = null;
    private queue: RedisStreamQueue;

    constructor() {
        this.queue = RedisStreamQueue.getInstance(QueueNames.VideoTranscodingQueue);
    }

    // Simulate sending an event to a queue
    public sendEventToQueue(jobName: string, videoId: string): boolean {
        console.log(`Sending videoId: ${videoId} to the queue...`);
        this.queue.sendEvent(jobName, { videoId });
        return true;
    }

    /**
     * Returns the singleton instance of EventQueueService.
     * If the instance does not exist, it creates a new one.
     * @returns The singleton instance of EventQueueService.
     */
    public static getInstance(): EventQueueService {
        if (!EventQueueService.instance) {
            EventQueueService.instance = new EventQueueService();
        }
        return EventQueueService.instance;
    }


}

export default EventQueueService;