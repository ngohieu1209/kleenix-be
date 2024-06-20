import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AdminManagerRepository, NotificationRepository } from 'src/models/repositories';
import _ from 'lodash';
import { NotificationService } from './notification.service';
import { MarkNotificationDto } from './dto/mark-notification.dto';

@WebSocketGateway(
  { 
    cors: { origin: true },
  }
)
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationRepository: NotificationRepository,
    private readonly adminManagerRepository: AdminManagerRepository
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  afterInit() {
    this.logger.log('Notification Websocket Initialized');
  }

  async handleConnection(client: Socket) {
    const clientId = client.id.toString();
    const customerId = client.handshake.auth?.customerId;
    const adminManagerId = client.handshake.auth?.adminManagerId;
    const houseWorkerId = client.handshake.auth?.houseWorkerId;
    
    if (!customerId && !adminManagerId && !houseWorkerId) {
      return this.disconnect(client);
    }
    this.logger.log(`Notification: User connected ${clientId}`);
    if(customerId) {
      client.join(`Customer:${customerId}`);
      const countUnread = await this.notificationService.countUnreadCustomer(customerId);
      client.emit('count-notification-unread', countUnread);
    }
    if(houseWorkerId) {
      client.join(`HouseWorker:${houseWorkerId}`);
      const countUnread = await this.notificationService.countUnreadHouseWorker(houseWorkerId);
      client.emit('count-notification-unread', countUnread);
    }
    if(adminManagerId) {
      client.join(`Admin:${adminManagerId}`);
      const countUnread = await this.notificationService.countUnreadAdmin();
      client.emit('count-notification-unread', countUnread);
    }
  }

  async handleDisconnect(client: Socket) {
    const clientId = client.id.toString();
    this.logger.log(`Notification: User disconnected ${clientId}`);
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }
  
  @SubscribeMessage('customer-notifications')
  async getNotificationsCustomer(
    @ConnectedSocket() client: Socket
  ) {
    const res = await this.notificationService.getNotificationsCustomer(client);
    client.emit('list-notification', res);
  }
  
  @SubscribeMessage('house-worker-notifications')
  async getNotificationsHouseWorker(
    @ConnectedSocket() client: Socket
  ) {
    const res = await this.notificationService.getNotificationsHouseWorker(client);
    client.emit('list-notification', res);
  }
  
  @SubscribeMessage('admin-notifications')
  async getNotificationsAdmin(
    @ConnectedSocket() client: Socket
  ) {
    const res = await this.notificationService.getNotificationsAdmin(client);
    client.emit('list-notification', res);
  }
  
  @SubscribeMessage('mark-notification')
  markNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MarkNotificationDto
  ) {
    this.notificationService.markNotificationAsRead(client, data);
  }
  
  @SubscribeMessage('mark-all-notification')
  markAllNotification(
    @ConnectedSocket() client: Socket
  ) {
    this.notificationService.markAllNotificationAsRead(client);
  }
  
  async refreshNotificationCustomer(customerId: string) {
    const notifications = await this.notificationRepository.getNotificationsCustomer(customerId);
    const countUnread = await this.notificationService.countUnreadCustomer(customerId);
    this.server.to(`Customer:${customerId}`).emit('list-notification', notifications);
    this.server.to(`Customer:${customerId}`).emit('count-notification-unread', countUnread);
    }
    
  async refreshNotificationWorker(houseWorkerId: string) {
    const notifications = await this.notificationRepository.getNotificationsHouseWorker(houseWorkerId);
    const countUnread = await this.notificationService.countUnreadHouseWorker(houseWorkerId);
    this.server.to(`HouseWorker:${houseWorkerId}`).emit('list-notification', notifications);
    this.server.to(`HouseWorker:${houseWorkerId}`).emit('count-notification-unread', countUnread);
  }
  
  async refreshNotificationAdmin() {
    const adminManagerIds = await this.adminManagerRepository.adminIdsExist();
    const notifications = await this.notificationRepository.getNotificationsAdmin();
    const countUnread = await this.notificationService.countUnreadAdmin();
    _.forEach(adminManagerIds, id => {
      this.server.to(`Admin:${id}`).emit('list-notification', notifications);
      this.server.to(`Admin:${id}`).emit('count-notification-unread', countUnread);
    })
  }
}
