import { DeploymentStatus } from "./enums/deployment.status";
export interface Deployment{
    imageId: string;
    status: DeploymentStatus;
}