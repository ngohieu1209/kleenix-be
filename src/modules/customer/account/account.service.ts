import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { Stripe } from 'stripe';
import { CustomerEntity, NotificationEntity } from 'src/models/entities';
import { CustomerRepository, NotificationRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { PaymentDto } from './dto/payment.dto';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { fCurrency } from 'src/shared/utils/utils';
import { NOTIFICATION_TYPE } from 'src/shared/enums/notification.enum';
import { NotificationGateway } from 'src/modules/notification/notification.gateway';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { UPLOAD_PATH } from 'src/shared/constants';

@Injectable()
export class CustomerAccountService {
  private stripe: Stripe;
  
  constructor(
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly uploadLocalService: UploadLocalService,
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.stripeSecretKey', { infer: true }), {
      apiVersion: '2024-04-10',
      typescript: true,
    })
  }

  async getMe(userId: string): Promise<CustomerEntity> {
    return await this.customerRepository.getCustomerById(userId);
  }
  
  async updateInformation(userId: string, updateUser: UpdateCustomerDto, avatar: Express.Multer.File) {
    const customer = await this.customerRepository.getCustomerById(userId);
    if(avatar) {
      if(customer.avatar) {
        await this.uploadLocalService.deleteFile(customer.avatar)
      }
      const avatarImage: string = (await this.uploadLocalService.putFile(avatar, UPLOAD_PATH.IMAGE, 'avatar'))?.path
      customer.avatar = avatarImage
    }
    const saveCustomer = await this.customerRepository.save({
      ...customer,
      ...updateUser
    });

    return saveCustomer;
  }
  
  async requestPayment(customerId: string, bodyPayment: PaymentDto) {
    try {
      const customer = await this.customerRepository.getCustomerById(customerId);
      const { amount } = bodyPayment;
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Number(amount),
        currency: 'vnd',
        payment_method_types: ['card'],
        shipping: {
          name: 'Milo Ngo',
          address: {
            country: 'VN',
          }
        }
      })
      const clientSecret = paymentIntent.client_secret;
      return {
        amount,
        clientSecret
      };
    } catch (error) {
      console.log('winter-request-payment-error', error);
      throw new BaseException(ERROR.REQUEST_PAYMENT_FAIL);
    }
  }
  
  async paymentSuccess(customerId: string, bodyPayment: PaymentDto) {
    try {
      const customer = await this.customerRepository.getCustomerById(customerId);
      const { amount } = bodyPayment;
      customer.kPay = Number(customer.kPay) + Number(amount);
      const updatedCustomer = await this.customerRepository.save(customer);
      const newNotification = new NotificationEntity();
      newNotification.customer = updatedCustomer;
      newNotification.body = `Nạp ${fCurrency(Number(amount))} vào tài khoản KPAY thành công`;
      newNotification.type = NOTIFICATION_TYPE.TOPUP;
      await this.notificationRepository.save(newNotification);
      await this.notificationGateway.refreshNotificationCustomer(customerId);
      return updatedCustomer.kPay;
    } catch (error) {
      console.log('winter-payment-error', error);
      throw new BaseException(ERROR.PAYMENT_SUCCESS_FAIL);
    }
  }
}