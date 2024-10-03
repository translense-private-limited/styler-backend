import { LoginDto } from "@modules/atuhentication/dtos/login.dto";
import { Injectable } from "@nestjs/common";
import { OwnerService } from "./owner.service";
import { OwnerEntity } from "../entities/owner.entity";

@Injectable()
export class SellerExternalService {
    constructor( private sellerService: OwnerService){}

    async getSellers(loginDto: LoginDto): Promise<OwnerEntity> {
        return await this.sellerService.getSellerByEmailAndPassword(loginDto)
    }
}