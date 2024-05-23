import { Body, Controller, Get, ParseFilePipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { CustomerAccountService } from './account.service';
import { JwtPayload } from 'src/shared/dtos';
import { CustomerEntity } from 'src/models/entities';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { PaymentDto } from './dto/payment.dto';

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
  async updateInformationCustomer(
    @Body() updateCustomer: UpdateCustomerDto,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.customerAccountService.updateInformation(data.userId, updateCustomer);
  }
  
  @ApiOperation({
    summary: 'yêu cầu nạp tiền',
  })
  @Post('request-payment')
  async requestPayment(
    @Body() bodyPayment: PaymentDto,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.customerAccountService.requestPayment(data.userId, bodyPayment);
  }
  
  @ApiOperation({
    summary: 'nạp tiền thành công',
  })
  @Post('payment-success')
  async paymentSuccess(
    @Body() bodyPayment: PaymentDto,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.customerAccountService.paymentSuccess(data.userId, bodyPayment);
  }
}