import { Body, Controller, Post, Res } from "@nestjs/common";
import { SellerAuthService } from "../services/seller-auth.service";
import { SellerLoginDto } from "../dtos/seller-login.dto";

@Controller('client')
export class ClientAuthController{
    constructor(
        private clientAuthService: SellerAuthService
    ){}

    @Post()
    async login(@Body() clientLoginDto: SellerLoginDto, @Res() res: Response): Promise<any> {
        const { seller, jwtToken } = await this.clientAuthService.login(clientLoginDto)
        res.headers.append('token', jwtToken)
        return seller   
    }
}
