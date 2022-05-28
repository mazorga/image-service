import { Controller, Get, Post ,Body, Param, Query} from "@nestjs/common";
import { DeploymentService } from "./deployments.service";
import { BasePaginationQueryModel } from "../base.models/base.pagination.query.model";
import { ApiQuery } from "@nestjs/swagger";
import { CreateDeploymentModel} from './create.deployment.model'

@Controller('api/v1/deployments')
export class DeploymentsController{

    constructor(private readonly deploymentService: DeploymentService){}
    
    @Post()
    @ApiQuery({ name: 'imageId'  })
    async createDeployment(@Query() createDeploymentModel: CreateDeploymentModel) {
        console.log(createDeploymentModel);
        await this.deploymentService.createDeployment(createDeploymentModel.imageId);
    }

    @Get()
    async  getDeployments(@Query() deploymentsQuery: BasePaginationQueryModel){
        
         return await this.deploymentService.getDeployments(deploymentsQuery.pageSize,deploymentsQuery.lastItem);
    }

    @Get('count')
    async countDeployments(){
         return await this.deploymentService.count()
    }
}