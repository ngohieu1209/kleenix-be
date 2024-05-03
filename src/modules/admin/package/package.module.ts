import { Module } from '@nestjs/common';
import { ManagePackageController } from './package.controller';
import { ManagePackageService } from './package.service';

@Module({
  controllers: [ManagePackageController],
  providers: [ManagePackageService],
})
export class ManagePackageModule {}