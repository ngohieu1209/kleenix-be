import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import {
  CustomerRepository,
} from 'src/models/repositories';
import { Request } from 'express';

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request[COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM].userId;
    const customer = await this.customerRepository.getCustomerById(userId);
    if (!customer.verify) {
      throw new BaseException(ERROR.ACCOUNT_NOT_VERIFIED);
    }
    return true;
  }
}