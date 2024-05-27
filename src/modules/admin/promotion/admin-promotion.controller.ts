import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { PromotionIdDto } from 'src/shared/dtos';
import { PromotionEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';
import { ManagePromotionService } from './admin-promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@ApiTags('Admin | Promotion')
@ApiBearerAuth()
@Controller('admin/promotion')
@Roles([Role.Admin])
export class ManagePromotionController {
  constructor( private readonly managePromotionService: ManagePromotionService ) {}
  
  @ApiOperation({
    summary: 'Create a promotion',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post('new')
  async createPromotion(
    @Body() createPromotion: CreatePromotionDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) image?: Express.Multer.File,
  ): Promise<PromotionEntity> {
    return this.managePromotionService.createPromotion(createPromotion, image);
  }
  
  @ApiOperation({
    summary: 'get information a promotion',
  })
  @Get('detail/:promotionId')
  async getPromotion(
    @Param() paramPromotionId: PromotionIdDto, 
  ): Promise<any> {
    return this.managePromotionService.getPromotion(paramPromotionId.promotionId);
  }
  
  @ApiOperation({
    summary: 'get list all promotions',
  })
  @Get('list')
  async getListPromotions(
  ): Promise<any> {
    return await this.managePromotionService.getListPromotions();
  }
  
  @ApiOperation({
    summary: 'update information promotion',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':promotionId')
  async updatePromotion(
    @Param() paramPromotionId: PromotionIdDto, 
    @Body() updatePromotion: UpdatePromotionDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) image?: Express.Multer.File,
  ): Promise<boolean> {
    return this.managePromotionService.updatePromotion(paramPromotionId.promotionId, updatePromotion, image);
  }
  
  @ApiOperation({
    summary: 'delete a promotion',
  })
  @Delete(':promotionId')
  async deletePromotion(
    @Param() paramPromotionId: PromotionIdDto,
  ): Promise<boolean> {
    return this.managePromotionService.deletePromotion(paramPromotionId.promotionId);
  }
}