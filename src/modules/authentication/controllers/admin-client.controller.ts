import { Controller, Put, Param, Body } from '@nestjs/common';
import { ResetClientPasswordDto } from '../dtos/admin-reset-client-password.dto';
import { AdminClientService } from '../services/admin-client.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('admin/client')
export class AdminClientController {
  constructor(private readonly adminClientService: AdminClientService) { }

  @ApiOperation({
    summary: "Enables admin to change client's password without otp"
  })
  @Put('reset-password/:clientId')
  async resetPassword(
    @Param('clientId') clientId: number,
    @Body() resetPasswordDto: ResetClientPasswordDto
  ): Promise<String> {
    return await this.adminClientService.resetClientPassword(clientId, resetPasswordDto);
  }
}
