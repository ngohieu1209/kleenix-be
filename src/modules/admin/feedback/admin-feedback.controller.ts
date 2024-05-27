import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData, Roles } from 'src/shared/decorators/auth.decorator';

import { FeedbackIdDto} from 'src/shared/dtos';
import { Role } from 'src/shared/enums/role.enum';
import { ManageFeedbackService } from './admin-feedback.service';

@ApiTags('Admin | Feedback')
@ApiBearerAuth()
@Controller('admin/feedback')
@Roles([Role.Admin])
export class ManageFeedbackController {
  constructor(private readonly manageFeedbackService: ManageFeedbackService) { }
    
  @ApiOperation({
    summary: 'Xem list feedback',
  })
  @Get('list')
  async getListFeedback(): Promise<any> {
    return this.manageFeedbackService.getListFeedback();
  }
  
  @ApiOperation({
    summary: 'Xem chi tiết feedback',
  })
  @Get('detail/:feedbackId')
  async getFeedback(
    @Param() paramFeedbackId: FeedbackIdDto, 
  ): Promise<any> {
    return this.manageFeedbackService.getFeedback(paramFeedbackId.feedbackId);
  }
}