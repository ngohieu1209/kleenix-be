import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Public,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { JwtPayload, RefreshTokenRequestDto, RefreshTokenResponseDto } from 'src/shared/dtos';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginRequestDto, AdminLoginResponseDto } from './dto/admin-login.dto';

@Controller('admin/auth')
@ApiTags('Admin | Auth')
@ApiBearerAuth()
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiOperation({
    summary: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AdminLoginResponseDto,
  })
  @Post('login')
  @Public()
  async login(
    @Body() adminLoginRequest: AdminLoginRequestDto,
  ): Promise<AdminLoginResponseDto> {
    return this.adminAuthService.login(adminLoginRequest);
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
    return this.adminAuthService.refreshToken(
      refreshTokenRequestDto.accessToken,
      refreshTokenRequestDto.refreshToken,
    );
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
    const logoutResult = await this.adminAuthService.logout(token, data.userId);

    return {
      logoutResult,
    };
  }
}
