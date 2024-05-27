import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload, PromotionIdDto, ServiceIdDto } from 'src/shared/dtos';
import { VerifyGuard } from 'src/shared/guards/verify.guard';
import { PromotionService } from './promotion.service';

@ApiTags('Customer | Promotion')
@ApiBearerAuth()
@Controller('promotion')
@UseGuards(VerifyGuard)
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) { }
    
  @ApiOperation({
    summary: 'Danh sách khuyến mãi có thể sử dụng',
  })
  @Get('list/usable')
  async getListUsablePromotion(
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.promotionService.getListUsablePromotion(data.userId);
  }
  
  @ApiOperation({
    summary: 'Danh sách khuyến mãi có thể claim',
  })
  @Get('list')
  async getListUsableClaim(
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.promotionService.getListUsableClaim(data.userId);
  }
  
  @ApiOperation({
    summary: 'Claim khuyến mãi',
  })
  @Post('claim')
  async claimPromotion(
    @JwtDecodedData() data: JwtPayload,
    @Body() claimPromotionBody: PromotionIdDto
  ): Promise<any> {
    return this.promotionService.claimPromotion(data.userId, claimPromotionBody.promotionId);
  }
}