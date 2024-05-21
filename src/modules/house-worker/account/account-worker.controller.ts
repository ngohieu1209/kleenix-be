import { Body, Controller, Get, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from 'src/shared/dtos';
import { HouseWorkerEntity } from 'src/models/entities';
import { WorkerAccountService } from './account-worker.service';

@Controller('house-worker')
@ApiTags('House Worker | Account')
@ApiBearerAuth()
export class WorkerAccountController {
  constructor(private readonly workerAccountService: WorkerAccountService) {}

  @ApiOperation({
    summary: 'get information house worker',
  })
  @Get('get-me')
  async getMe(
    @JwtDecodedData() data: JwtPayload
  ): Promise<HouseWorkerEntity> {
    return this.workerAccountService.getMe(data.userId);
  }
}