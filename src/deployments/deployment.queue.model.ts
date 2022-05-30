import { DeploymentQueueStatus } from "./enums/deployment.queue.status";

export interface DeploymentQueue{
    name: string,
    pendingDeployments: [string];
    state: DeploymentQueueStatus
}