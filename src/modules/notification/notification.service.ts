import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import {  } from 'src/models/entities';
import { NotificationRepository } from 'src/models/repositories';
import _ from 'lodash';
import { MarkNotificationDto } from './dto/mark-notification.dto';
import { IsNull } from 'typeorm';


@Injectable()
export class NotificationService {
  @WebSocketServer() server: Server;
  
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async countUnreadCustomer(customerId: string) {
    const count = await this.notificationRepository.countUnreadNotificationCustomer(customerId);
    return {
      count
    }
  }
  
  async countUnreadHouseWorker(houseWorkerId: string) {
    const count = await this.notificationRepository.countUnreadNotificationWorker(houseWorkerId);
    return {
      count
    }
  }
  
  async countUnreadAdmin() {
    const count = await this.notificationRepository.countUnreadNotificationAdmin();
    return {
      count
    }
  }
  
  async getNotificationsCustomer(client: Socket) {
    const customerId = client.handshake.auth?.customerId;
    
    if(customerId) {
      const notifications = await this.notificationRepository.getNotificationsCustomer(customerId);
      return notifications;
    }
    return [];
  }
  
  async getNotificationsHouseWorker(client: Socket) {
    const houseWorkerId = client.handshake.auth?.houseWorkerId;
    
    if(houseWorkerId) {
      const notifications = await this.notificationRepository.getNotificationsHouseWorker(houseWorkerId);
      return notifications;
    }
    return [];
  }
  
  async getNotificationsAdmin(client: Socket) {
    const adminManagerId = client.handshake.auth?.adminManagerId;
    
    if(adminManagerId) {
      const notifications = await this.notificationRepository.getNotificationsAdmin();
      return notifications;
    }
    return [];
  }
  
  async markNotificationAsRead(client: Socket, data: MarkNotificationDto) {
    const { notificationId } = data;
    const customerId = client.handshake.auth?.customerId;
    const houseWorkerId = client.handshake.auth?.houseWorkerId;
    const adminManagerId = client.handshake.auth?.adminManagerId;
    
    await this.notificationRepository.update(notificationId, { isMark: true });
    if(customerId) {
      const countUnread = await this.notificationRepository.countUnreadNotificationCustomer(customerId);
      client.emit('count-notification-unread', countUnread);
    }
    if(houseWorkerId) {
      const countUnread = await this.notificationRepository.countUnreadNotificationWorker(houseWorkerId);
      client.emit('count-notification-unread', countUnread);
    }
    if(adminManagerId) {
      const countUnread = await this.notificationRepository.countUnreadNotificationAdmin();
      client.emit('count-notification-unread', countUnread);
    }
  }
  
  async markAllNotificationAsRead(client: Socket) {
    const customerId = client.handshake.auth?.customerId;
    const houseWorkerId = client.handshake.auth?.houseWorkerId;
    const adminManagerId = client.handshake.auth?.adminManagerId;
    
    if(customerId) {
      await this.notificationRepository.update({ customer: { id: customerId } }, { isMark: true });
      const countUnread = await this.notificationRepository.countUnreadNotificationCustomer(customerId);
      const listNotification = await this.notificationRepository.getNotificationsCustomer(customerId);
      client.emit('count-notification-unread', countUnread);
      client.emit('list-notification', listNotification);
    }
    if(houseWorkerId) {
      await this.notificationRepository.update({ houseWorker: { id: houseWorkerId } }, { isMark: true });
      const countUnread = await this.notificationRepository.countUnreadNotificationWorker(houseWorkerId);
      const listNotification = await this.notificationRepository.getNotificationsHouseWorker(houseWorkerId);
      client.emit('count-notification-unread', countUnread);
      client.emit('list-notification', listNotification);
    }
    if(adminManagerId) {
      await this.notificationRepository.update({ customer: IsNull(), houseWorker: IsNull() }, { isMark: true });
      const countUnread = await this.notificationRepository.countUnreadNotificationAdmin();
      const listNotification = await this.notificationRepository.getNotificationsAdmin();
      client.emit('count-notification-unread', countUnread);
      client.emit('list-notification', listNotification);
    }
  }
}
