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
import { VerifyPhoneNumberDto } from './dto/verify.dto';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { VerifyCodeForgetDto } from './dto/verify-forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @ApiOperation({
    summary: 'Verify phone number',
  })
  @Post('/verify')
  async verifyAccount(
    @Body() verifyPhoneNumber: VerifyPhoneNumberDto,
    @JwtDecodedData() data: JwtPayload
  ) {
    return this.authService.verifyAccount(data.userId, verifyPhoneNumber.code);
  }

  @ApiOperation({
    summary: 'Resend sms code',
  })
  @Post('/resend-sms')
  async resendSms(
    @JwtDecodedData() data: JwtPayload
  ) {
    return this.authService.resendOTP(data.userId);
  }

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
  
  @ApiOperation({
    summary: 'check phone number exist',
  })
  @Post('check-phone-exist')
  @Public()
  async checkPhoneExist(
    @Body() bodyPhoneNumber: PhoneNumberDto
  ): Promise<any> {
    return this.authService.checkPhoneExist(bodyPhoneNumber.phoneNumber);
  }
  
  @ApiOperation({
    summary: 'verify code forget password',
  })
  @Post('verify-code-forgot-password')
  @Public()
  async verifyCodeForgetPassword(
    @Body() verifyCode: VerifyCodeForgetDto
  ): Promise<any> {
    return this.authService.verifyCodeForgetPassword(verifyCode);
  }
  
  @ApiOperation({
    summary: 'reset password',
  })
  @Post('reset-password')
  @Public()
  async resetPassword(
    @Body() bodyResetPassword: ResetPasswordDto
  ): Promise<any> {
    return this.authService.resetPassword(bodyResetPassword);
  }
  
  @ApiOperation({
    summary: 'Resend sms code forgot password',
  })
  @Post('/resend-sms-forgot-password')
  @Public()
  async resendSmsForgotPassword(
    @Body() data: PhoneNumberDto
  ) {
    return this.authService.resendOTPForgotPassword(data.phoneNumber);
  }

}
