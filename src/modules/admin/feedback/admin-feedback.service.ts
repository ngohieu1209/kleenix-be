import { BadRequestException, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { FeedbackRepository } from 'src/models/repositories';

@Injectable()
export class ManageFeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async getListFeedback(): Promise<any> {
    const feedbacks = await this.feedbackRepository.getListFeedback();
    return feedbacks;
  }
  
  async getFeedback(feedbackId: string): Promise<any> {
    const feedback = await this.feedbackRepository.getFeedbackById(feedbackId);
    return feedback;
  }
}