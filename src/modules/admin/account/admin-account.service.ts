import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { AdminManagerEntity } from 'src/models/entities';
import { AdminManagerRepository, BookingRepository, CustomerRepository, FeedbackRepository, HouseWorkerRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminManagerRepository: AdminManagerRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly feedbackRepository: FeedbackRepository
  ) {}

  async getMe(userId: string): Promise<AdminManagerEntity> {
    return await this.adminManagerRepository.getAdminManagerById(userId);
  }
  
  async getOverview(userId: string): Promise<any> {
    const totalCustomer = await this.customerRepository.amountCustomer();
    const totalHouseWorker = await this.houseWorkerRepository.amountHouseWorker();
    const totalBooking = await this.bookingRepository.amountBooking();
    const totalFeedback = await this.feedbackRepository.amountFeedback();
    
    const balanceThisYear = await this.bookingRepository.getTotalPriceThisYear();
    const bookingThisYear = await this.bookingRepository.getTotalBookingCompletedThisYear();
    
    const analyticsBalance = await this.bookingRepository.getTotalPricesByYearAndMonth();
    const topCustomers = await this.customerRepository.getTopCustomersSpend();
    
    const topHouseWorkers = await this.houseWorkerRepository.getTopHouseWorkers();
    
    const getStatusOverview = await this.bookingRepository.getStatusOverview();
    
    return {
      common: {
        totalCustomer,
        totalHouseWorker,
        totalBooking,
        totalFeedback,
      },
      balance: {
        currentBalance: balanceThisYear || 0,
        bookingCompleted: bookingThisYear || 0,
      },
      analytics: analyticsBalance || [],
      topCustomers: topCustomers || [],
      topHouseWorkers: topHouseWorkers || [],
      statusOverview: getStatusOverview || [],
    }
  }
}