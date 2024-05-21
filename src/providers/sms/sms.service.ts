import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { COMMON_CONSTANT } from 'src/shared/constants';
import { convertPhoneToInternational } from 'src/shared/utils/utils';

@Injectable()
export class SmsService {
  private twilio: Twilio;
  private redisInstance: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    const accountSid = this.configService.get('twilio.accountSID', { infer: true });
    const authToken = this.configService.get('twilio.authToken', { infer: true });
    this.twilio = new Twilio(accountSid, authToken);
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }

  async initiatePhoneNumberVerification(phone: string, code: string): Promise<any> {
    try {
      const verification = await this.twilio.messages
        .create({
          body: `Mã xác thực Kleenix của bạn là: ${code}`,
          from: this.configService.get('twilio.senderPhoneNumber', { infer: true }),
          to: convertPhoneToInternational(phone),
        })
      return verification;
    } catch (e) {
      console.error('sms-error', e);
      throw new BadRequestException('Đã có lỗi xảy ra');
    }
  }
}