export enum BOOKING_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  WORKING = 'WORKING',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_KLEENIX = 'CANCELLED_BY_KLEENIX',
  DELIVERY = 'DELIVERY',
  COMPLETED = 'COMPLETED',
}

export enum PAYMENT_STATUS {
  CASH = 'CASH',
  KPAY = 'KPAY',
}