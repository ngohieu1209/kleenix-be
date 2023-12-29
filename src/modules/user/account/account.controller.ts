import { Body, Controller, Get, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { UserAccountService } from './account.service';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { UserEntity } from 'src/models/entities';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User | Account')
@ApiBearerAuth()
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @ApiOperation({
    summary: 'get information user',
  })
  @Get('get-me')
  async getMe(
    @JwtDecodedData() data: JwtPayload
  ): Promise<UserEntity> {
    return this.userAccountService.getMe(data.userId);
  }

  @ApiOperation({
    summary: 'update information user',
  })
  @Patch('edit')
  async updateInformationStudent(
    @Body() updateUser: UpdateUserDto,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<string> {
    return this.userAccountService.updateInformation(data.userId, updateUser);
  }
}