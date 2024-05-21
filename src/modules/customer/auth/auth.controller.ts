import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Public,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { AuthService } from './auth.service';
import { JwtPayload } from 'src/shared/dtos';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from 'src/shared/dtos';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/password.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<any> {
    return this.authService.login(loginRequestDto);
  }

  // @Get('verify')
  // @Roles([Role.Admin])
  // verify(@JwtDecodedData() data: JwtPayload): JwtPayload {
  //   return data;
  // }

  @ApiOperation({
    summary: 'Register a new customer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterResponseDto,
  })
  @Post('register')
  @Public()
  async registerStudent(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerRequestDto);
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
    return this.authService.refreshToken(
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
    @Body() changePassword: ChangePasswordDto,
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.authService.changePassword(data.userId, changePassword.oldPassword, changePassword.newPassword);
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LogoutResponseDto,
  })
  @Post('logout')
  async logout(
    @Req() req: Request,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<LogoutResponseDto> {
    const token = req.headers.authorization.split(' ')[1];
    const logoutResult = await this.authService.logout(token, data.userId);

    return {
      logoutResult,
    };
  }
}
