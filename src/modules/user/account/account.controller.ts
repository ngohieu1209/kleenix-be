import { Body, Controller, Get, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { UserAccountService } from './account.service';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { UserEntity } from 'src/models/entities';

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

  // @ApiOperation({
  //   summary: 'Cập nhật thông tin học sinh',
  // })
  // @ApiConsumes('multipart/form-data')
  // @Patch('information')
  // @UseInterceptors(FileInterceptor('avatar'))
  // async updateInformationStudent(
  //   @Body() updateInformationStudent: UpdateInformationStudentDto,
  //   @JwtDecodedData() data: JwtPayload,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new ImageFileValidator({})],
  //       fileIsRequired: false
  //     }),
  //   ) avatar?: Express.Multer.File,
  // ): Promise<any> {
  //   return this.studentAccountService.updateInformationStudent(data.userId, updateInformationStudent, avatar);
  // }
}