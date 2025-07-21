### Introduction

This is main README.md of the project
For set up, go to each module's README.md file in sequence

1. [redis-event-gateway](/modules/redis-event-gateway/README.md)
2. [redis-bullboard-monitor](/modules/redis-bullboard-monitor/README.md)
3. [redis-event-consumer](/modules/redis-event-consumer/README.md)

Once you are comfortable setting up on local and understand the flow, you can deploy this project on
any cloud provider. I have user SAP Business Technology platform.

### Deployment to BTP

1. Ensure you are logged in to the subaccount through terminal. Check `cf target`

2. Ensure Redis service - "Redis, Hyperscaler Option" is entitled to your subaccount

3. Go to the root **(redis-event-hub)** of the folder and build 
```
mbt build
```

4. Deploy to cloud foundry environment
```
cf deploy mta_archives/redis-event-hub_0.0.1.mtar
```

### Notes

- For production deployments, **always secure all endpoints and UIs** (such as BullBoard) with authentication and HTTPS.
- Do **not** expose sensitive dashboards or APIs without proper access control.
- Regularly monitor logs and queue health for any anomalies.

