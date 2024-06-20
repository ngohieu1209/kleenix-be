import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { BookingIdDto, JwtPayload, PromotionIdDto, ServiceIdDto } from 'src/shared/dtos';
import { VerifyGuard } from 'src/shared/guards/verify.guard';
import { PostFeedbackDto } from './dto/post-feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('Customer | Feedback')
@ApiBearerAuth()
@Controller('feedback')
@UseGuards(VerifyGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }
    
  @ApiOperation({
    summary: 'Xem feedback của lịch đã completed',
  })
  @Get('')
  async getFeedback(
    @JwtDecodedData() data: JwtPayload,
    @Query() queryBookingId: BookingIdDto
  ): Promise<any> {
    return this.feedbackService.getFeedback(data.userId, queryBookingId.bookingId);
  }
  
  @ApiOperation({
    summary: 'Gửi feedback',
  })
  @Post('new')
  async sendFeedback(
    @JwtDecodedData() data: JwtPayload,
    @Body() postFeedback: PostFeedbackDto
  ): Promise<any> {
    return this.feedbackService.feedback(data.userId, postFeedback);
  }
}