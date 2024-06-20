import { Body, Controller, Get, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from 'src/shared/dtos';
import { HouseWorkerEntity } from 'src/models/entities';
import { WorkerAccountService } from './account-worker.service';
import { UpdateCustomerDto } from 'src/modules/customer/account/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';

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
  
  @ApiOperation({
    summary: 'update information user',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('edit')
  async updateInformationCustomer(
    @Body() updateCustomer: UpdateCustomerDto,
    @JwtDecodedData() data: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) avatar?: Express.Multer.File,
  ): Promise<any> {
    return this.workerAccountService.updateInformation(data.userId, updateCustomer, avatar);
  }
  
}