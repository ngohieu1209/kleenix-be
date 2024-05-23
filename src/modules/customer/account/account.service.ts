import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { Stripe } from 'stripe';
import { CustomerEntity } from 'src/models/entities';
import { CustomerRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { PaymentDto } from './dto/payment.dto';
import { UpdateCustomerDto } from './dto/update-user.dto';

@Injectable()
export class CustomerAccountService {
  private stripe: Stripe;
  
  constructor(
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.stripeSecretKey', { infer: true }), {
      apiVersion: '2024-04-10',
      typescript: true,
    })
  }

  async getMe(userId: string): Promise<CustomerEntity> {
    return await this.customerRepository.getCustomerById(userId);
  }
  
  async updateInformation(userId: string, updateUser: UpdateCustomerDto) {
    const { phoneCode, phoneNumber, name } = updateUser;
    const { affected } = await this.customerRepository.update({ id: userId }, {
      phoneCode,
      phoneNumber,
      name
    })
    if(affected > 0) {
      return "Cập nhật thành công"
    }
    throw new BaseException(ERROR.UPDATE_FAIL)
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
      return updatedCustomer.kPay;
    } catch (error) {
      console.log('winter-payment-error', error);
      throw new BaseException(ERROR.PAYMENT_SUCCESS_FAIL);
    }
  }
}