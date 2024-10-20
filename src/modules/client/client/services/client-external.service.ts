import { LoginDto } from "@modules/atuhentication/dtos/login.dto";
import { Injectable } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientEntity } from "../entities/client.entity";

@Injectable()
export class ClientExternalService {
    constructor( private sellerService: ClientService){}

    async getSellers(loginDto: LoginDto): Promise<ClientEntity> {
        return await this.sellerService.getSellerByEmail(loginDto)
    }
}