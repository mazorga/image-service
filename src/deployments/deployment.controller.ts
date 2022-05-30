import { Controller, Get, Post ,Body, Param, Query} from "@nestjs/common";
import { DeploymentService } from "./deployment.service";
import { BasePaginationQueryModel } from "../base.models/base.pagination.query.model";
import { ApiQuery ,ApiTags} from "@nestjs/swagger";
import { CreateDeploymentModel} from './create.deployment.model'

@ApiTags('deployments')
@Controller('api/v1/deployments')
export class DeploymentsController{

    constructor(private readonly deploymentService: DeploymentService){}
    
    @Post()
    @ApiQuery({ name: 'imageId'  })
    async createDeployment(@Query() params: CreateDeploymentModel) {
        return await this.deploymentService.createDeployment(params.imageId);
    }

    @Get()
    async  getDeployments(@Query() deploymentsQuery: BasePaginationQueryModel){
        
         return await this.deploymentService.getDeployments(deploymentsQuery.pageSize,deploymentsQuery.lastItem);
    }

    @Get('count')
    async countDeployments(){
         return await this.deploymentService.count();
    }
}