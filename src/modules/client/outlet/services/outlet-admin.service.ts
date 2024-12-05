import { OutletRepository } from "../repositories/outlet.repository";
import { OutletService } from "./outlet.service";

export class OutletAdminService{
    constructor(
        private readonly outletRepository:OutletRepository,
        private readonly outletService:OutletService
    ){}

    
}