import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Public,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { JwtPayload, RefreshTokenRequestDto, RefreshTokenResponseDto } from 'src/shared/dtos';
import { WorkerLoginRequestDto, WorkerLoginResponseDto } from './dto/worker-login.dto';
import { WorkerAuthService } from './worker-auth.service';
import { WorkerChangePasswordDto } from './dto/worker-password.dto';

@Controller('house-worker/auth')
@ApiTags('House Worker | Auth')
@ApiBearerAuth()
export class WorkerAuthController {
  constructor(private readonly workerAuthService: WorkerAuthService) {}

  @ApiOperation({
    summary: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WorkerLoginResponseDto,
  })
  @Post('login')
  @Public()
  async login(
    @Body() workerLoginRequest: WorkerLoginRequestDto,
  ): Promise<any> {
    return this.workerAuthService.login(workerLoginRequest);
  }

  @ApiOperation({
    summary: 'Refresh token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RefreshTokenResponseDto,
  })
  @Post('refresh-token')
  @Public()
  refreshToken(
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.workerAuthService.refreshToken(
      refreshTokenRequestDto.accessToken,
      refreshTokenRequestDto.refreshToken,
    );
  }
  
  @ApiOperation({
    summary: 'Change password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() changePassword: WorkerChangePasswordDto,
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.workerAuthService.changePassword(data.userId, changePassword.oldPassword, changePassword.newPassword);
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('logout')
  async logout(
    @Req() req: Request,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const logoutResult = await this.workerAuthService.logout(token, data.userId);

    return {
      logoutResult,
    };
  }
}
