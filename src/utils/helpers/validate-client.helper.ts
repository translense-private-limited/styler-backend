import { ClientIdDto } from "../dtos/client-id.dto";

export function validateClient(clientIdDto:ClientIdDto,outletId:number):Boolean{
    return clientIdDto.outletIds.includes(outletId)
}   