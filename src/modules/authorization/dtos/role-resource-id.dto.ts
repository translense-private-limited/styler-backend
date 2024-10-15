import { IsNumber } from "class-validator";

export class RoleResourceIdDto{
    @IsNumber()
    roleId: number

    @IsNumber()
    resourceId: number
}