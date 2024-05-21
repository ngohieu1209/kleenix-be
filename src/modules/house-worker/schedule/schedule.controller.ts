import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload, ServiceIdDto } from 'src/shared/dtos';
import { QueryScheduleDto } from './dto/query-schedule.dto';
import { ScheduleService } from './schedule.service';

@ApiTags('House Worker | Schedule')
@ApiBearerAuth()
@Controller('house-worker/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }
  
  // TODO: danh sách các list assignment filter theo từng ngày
  @ApiOperation({
    summary: 'Danh sách tất cả các list assignment filter theo từng ngày',
  })
  @Get('list-assignment')
  async getListAssignment(
    @JwtDecodedData() data: JwtPayload,
    @Query() querySchedule: QueryScheduleDto
  ): Promise<any> {
    return this.scheduleService.getListAssignment(data.userId, querySchedule);
  }
}