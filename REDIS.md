## Redis for System Design: Beyond Caching

Redis is often perceived as a caching solution, but its true power lies in its versatile data structures that can be harnessed for robust system design. 
In this guide, we will explore how to set up Redis locally and delve into its various data structures that are instrumental in building scalable systems.

This hands-on guide will help you understand REDIS capabilities beyond caching, focusing on its application in system design.

#### Indexed Topics:

1. [Redis Set Up on Local Machine using Docker](#redis-set-up-on-local-machine-using-docker)
2. [Redis Set Up on Local Machine using Podman](#redis-set-up-on-local-machine-using-podman)
3. [Redis Queues](#redis-queues)
4. [Redis Streams](#redis-streams)
5. [Redis Sorted Sets](#redis-sorted-sets)
6. [Redis Cache](#redis-caches)
7. [Redis Geospatial Index](#redis-geospatial-indexes)

### REDIS SET UP On LOCAL MACHINE Using DOCKER 

1. Install Docker on your machine if you haven't already. You can download it from [Docker's official website](https://www.docker.com/get-started).

2. Open your terminal or command prompt.

3. Pull the latest Redis image from Docker Hub by running the following command:
   ```
   docker run --name local-redis -p 6379:6379 -d redis
   ```
   
4. Login to the Redis container:
    ```
   a. docker exec -it local-redis redis-cli
   
   b. SET mykey "Hello, Redis!"
   
   c. GET mykey
   ```
   
5. Ensure you get the response "Hello, Redis!". 

6. Clear the data by running:
   ```
   FLUSHALL
   ```

### REDIS SET UP On LOCAL MACHINE Using PODMAN

1. Install Podman on your machine if you haven't already. You can download it from [Podman's official website](https://podman.io/getting-started/installation).

2. Open your terminal or command prompt.

3. Pull the latest Redis image from Docker Hub by running the following command:
   ```
   podman run --name local-redis -p 6379:6379 -d redis
   ```
   
4. Login to the Redis container:
    ```       
   a. podman exec -it local-redis redis-cli
    
   b. SET mykey "Hello, Redis!"
    
   c. GET mykey
   ```

5. Ensure you get the response "Hello, Redis!".

6. Clear the data by running:
   ```
   FLUSHALL
   ```

### Redis Queues

1. What is a Redis Queue?
   - A Redis Queue is a simple data structure that allows you to implement a First In, First Out (FIFO) queue using Redis commands. 
   - It is typically implemented using Redis lists, where you can push items to one end of the list and pop items from the other end.
   
2. To create a Redis queue, you can use the `LPUSH` command to add items to the queue and the `RPOP` command to remove items from the queue.

3. Example commands:
   ```
   a. LPUSH video_queue "video1" "video2" "video3"
    - (integer) 3
   c. RPOP video_queue
    - "video1"
   d. LLEN video_queue
    - (integer) 2
   ```
   
4. The `RPOP` command will return "video1", which is the first item added to the queue following FIFO (First In, First Out) order.

5. Flow diagram
    ```mermaid
   flowchart TD
   A[Frontend / API] -->|LPUSH job| B[(Redis Queue)]
   B -->|RPOP job| C[Worker Service]
   ```
   
6. Use When?
    - You do not need persistent storage for the queued items.
    - You need fast, in-memory processing of tasks.
    - You want to implement a simple producer-consumer pattern.
    - You do not want history or retry mechanisms for failed tasks.
    - Simplicity > Flexibility
   
7. System Design use cases where you can use redis queues:
   - Rate Limiting: Implement rate limiting for API requests by queuing requests and processing them at a controlled rate.
   - Job Queues: Manage long-running jobs, such as video encoding or data analysis, by queuing jobs and processing them asynchronously.

### Redis Streams

1. What is Redis Streams?
   A Redis Stream is an append-only data structure — think of it as an ordered log of events.
   Each entry has:
   - An auto-generated ID (timestamp-sequence),
   - one or more key–value fields (like JSON attributes).

   Unlike a queue, data is not deleted when read — it stays available for replay, auditing, and multiple consumers.

2. To create a Redis Stream, you can use the `XADD` command to add entries to the stream and the `XREAD` command to read entries from the stream.

3. Example commands:
   ```
    XADD orders_stream * event_type "order_created" orderId 101
    XADD orders_stream * event_type "order_created" orderId 102
   ```

4. To see all entries in the stream, use:
   ```
    XRANGE orders_stream - +
   ```

5. Let's create a consumer group to read from the stream:
   ```
    XGROUP CREATE orders_stream order_consumer_group $ MKSTREAM
   ```

6. Add new entries to the stream:
   ```
    XADD orders_stream * event_type "order_created" orderId 103
    XADD orders_stream * event_type "order_created" orderId 104
   ```
7. Read entries from the stream using the consumer group:
   ```
    XREADGROUP GROUP order_consumer_group consumer-1 COUNT 1 STREAMS orders_stream >
   ```

8. View pending messages:
   ```
    XPENDING orders_stream order_consumer_group
   ```
   
9. Acknowledge processed messages:
   ```
    XACK orders_stream order_consumer_group <message-id>
   
    example: XACK orders_stream order_consumer_group 1627554478136-0
   ```
   
10. Flow diagram
    ```mermaid
    flowchart TD
    A[Order Service] -->|XADD order_created| B[(Redis Stream)]
    B -->|XREADGROUP GROUP \norder_consumers consumer-1| C[Worker 1]
    B -->|XREADGROUP GROUP \norder_consumers consumer-2| D[Worker 2]
    C -->|XACK| B
    D -->|XACK| B
    ```
    
11. Use When?
    - You need to retain a history of events for auditing or replay.
    - You have multiple consumers that need to read the same data independently.
    - You want built-in support for consumer groups and message acknowledgment.
    - You require more complex data structures with multiple fields per entry.
    - Parallel processing of messages is needed.
    - Flexibility > Simplicity

12. System Design use cases where you can use redis streams:
   - Asynchronous Microservices Communication: Use Redis Streams to facilitate communication between microservices, allowing them to publish and subscribe to events asynchronously.
   - Real-time Analytics: Stream user activity data for real-time analytics and monitoring dashboards.
   
### Redis Sorted Sets

1. What is a Redis Sorted Set?
   - A Redis Sorted Set is a collection of unique elements, each associated with a score. 
   - The elements are ordered based on their scores, allowing for efficient retrieval of elements in a specific order.
   - Sorted Sets are useful for scenarios where you need to maintain a leaderboard or ranking system.

2. To create a Redis Sorted Set, you can use the `ZADD` command to add elements with their associated scores and the `ZRANGE` command to retrieve elements in order.

3. Example commands:
   ```
   a. ZADD leaderboard 100 "player1" 200 "player2" 300 "player3"
    - (integer) 3
   b. ZRANGE leaderboard 0 -1 WITHSCORES
    - 1) "player1"
      2) "100"
    - 3) "player2"
      4) "200"
    - 5) "player3"
      6) "300"
   c. ZREVRANGE leaderboard 0 -1 WITHSCORES
    - 1) "player3"
      2) "300"
    - 3) "player2"
      4) "200"
    - 5) "player1"
      6) "100"
   ```
   
4. The `ZRANGE` command retrieves elements in ascending order of their scores, while the `ZREVRANGE` command retrieves them in descending order.

5. Update a player's score:
   ```
   ZINCRBY leaderboard 100 "player2"
   ```
   
6. Check the score again
    ```
    ZRANGE leaderboard 0 -1 WITHSCORES
    ```

7. Flow diagram
    ```mermaid
   flowchart TD
   A[Server] -->|ZADD player_score| B[(Redis Sorted Set)]
   B -->|ZRANGE leaderboard| C[Leaderboard Service]
   ```

8. Use When?
    - You need to maintain a ranked list of items based on scores.
    - You require efficient retrieval of top N items or items within a specific score range.
    - You want to perform operations like incrementing scores or removing items based on their rank.

9. System Design use cases where you can use redis sorted sets:
   - Leaderboards: Implement leaderboards for gaming applications and fitness apps, where players are ranked based on their scores.
   - Real-time Ranking Systems: Create real-time ranking systems for content, such as articles

### Redis Caches

1. What is a Redis Cache?
   - A Redis Cache is an in-memory data store used to temporarily store frequently accessed data to improve application performance and reduce latency.
   - It acts as a high-speed intermediary between the application and the primary database, allowing for faster data retrieval in distributed systems.

2. To use Redis as a cache, you can use the `SET` command to store data and the `GET` command to retrieve data.

3. Example commands:
   ```
   a. SET user:123 "John Doe"
    - OK
   b. GET user:123
    - "John Doe"
   ```

4. You can also set TTL (Time To Live) for cache entries using the `EX` option with the `SET` command:
   ```
   SET user:123 "John Doe" EX 60
    - OK
   ```
5. The above command sets the key "user:123" to expire after 60 seconds. Do a GET after 60 seconds to see that the key has expired.

6. Flow diagram
    ```mermaid
   flowchart TD
   A[Client Request] -->|Check Cache| B{Redis Cache}
   B -- Hit --> C[Return Cached Data]
   B -- Miss --> D[Fetch from Database]
   D --> E[Store in Cache]
   E --> C
   ```
   
7. Use When?
    - You need to reduce database load and improve response times for frequently accessed data.
    - You want to cache results of expensive computations or database queries.

8. System Design use cases where you can use redis caches:
   - Web Application Caching: Cache frequently accessed API responses to reduce server load and improve latency.
   - Systems like Ticketmaster use Redis cache to block seats that are being viewed by a user for a limited time to prevent double booking.
      
      
### Redis Geospatial Indexes

1. What is a Redis Geospatial Index?
   - A Redis Geospatial Index is a specialized data structure that allows you to store, query, and manipulate geospatial data (latitude and longitude coordinates) efficiently.
   - It enables you to perform operations such as finding nearby locations, calculating distances between points, and retrieving locations within a specific radius.

2. To create a Redis Geospatial Index, you can use the `GEOADD` command to add geospatial data and the `GEORADIUS` command to query nearby locations.

3. Example commands:
   ```
   a. GEOADD locations -74.0060 40.7128 "New York"
    - (integer) 1
   b. GEOADD locations -122.4194 37.7749 "San Francisco"
    - (integer) 1
   d. GEODIST locations "New York" "San Francisco" MI
    - "166.2742"
   ```
   
4. Find locations within a radius:
   ```
   GEORADIUS locations -74.0060 40.7128 3000 miles
    - 1) "New York"
    - 2) "San Francisco"
   ```

5. Flow diagram
    ```mermaid
   flowchart TD
    A[Client] -->|GEOADD location| B[(Redis Geospatial Index)]
    B -->|GEORADIUS query| C[Nearby Locations Service]
   ```

6. Use When?
    - You need to store and query geospatial data efficiently.
    - You want to perform location-based queries, such as finding nearby points of interest.

7. System Design use cases where you can use redis geospatial indexes:
   - Location-based Services: Implement features like finding nearby restaurants, stores, or service providers based on the user's current location.
   - Ride-Sharing Applications: Use geospatial indexes to match drivers with nearby passengers and optimize routes.
