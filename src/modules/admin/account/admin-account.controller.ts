import { Body, Controller, Get, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from 'src/shared/dtos';
import { AdminManagerEntity } from 'src/models/entities';
import { AdminAccountService } from './admin-account.service';

@Controller('admin')
@ApiTags('Admin | Account')
@ApiBearerAuth()
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @ApiOperation({
    summary: 'get information user',
  })
  @Get('get-me')
  async getMe(
    @JwtDecodedData() data: JwtPayload
  ): Promise<AdminManagerEntity> {
    return this.adminAccountService.getMe(data.userId);
  }
}