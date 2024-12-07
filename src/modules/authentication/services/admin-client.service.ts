import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { Injectable } from "@nestjs/common";
import { ResetClientPasswordDto } from "../dtos/admin-reset-client-password.dto";

@Injectable()
export class AdminClientService{
    constructor(private readonly clientExternalService:ClientExternalService){}

    async reserClientPassword(clientId,resetClientPasswordDto:ResetClientPasswordDto):Promise<String>{
        return this.clientExternalService.resetClientPassword(clientId,resetClientPasswordDto)
    }
}