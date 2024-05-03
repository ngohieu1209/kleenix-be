import { Body, Controller, Get, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { CustomerAccountService } from './account.service';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { CustomerEntity } from 'src/models/entities';
import { UpdateCustomerDto } from './dto/update-user.dto';

@Controller('customer')
@ApiTags('Customer | Account')
@ApiBearerAuth()
export class CustomerAccountController {
  constructor(private readonly customerAccountService: CustomerAccountService) {}

  @ApiOperation({
    summary: 'get information user',
  })
  @Get('get-me')
  async getMe(
    @JwtDecodedData() data: JwtPayload
  ): Promise<CustomerEntity> {
    return this.customerAccountService.getMe(data.userId);
  }

  @ApiOperation({
    summary: 'update information user',
  })
  @Patch('edit')
  async updateInformationStudent(
    @Body() updateCustomer: UpdateCustomerDto,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<string> {
    return this.customerAccountService.updateInformation(data.userId, updateCustomer);
  }
}