export const bookingHttpErrors = {
  BOOKING_NOT_FOUND: {
    message: 'Không tìm thấy đơn hàng',
    code: "BOOKING_00001",
  },
  BOOKING_NOT_PENDING: {
    message: 'Lịch đặt không ở trạng thái chờ',
    code: "BOOKING_00002",
  },
  BOOKING_NOT_COMPLETED: {
    message: 'Lịch đặt chưa hoàn thành',
    code: "BOOKING_00003",
  },
  FEEDBACK_EXIST: {
    message: 'Đã phản hồi cho lịch đặt này',
    code: "BOOKING_00004",
  },
  FEEDBACK_NOT_EXIST: {
    message: 'Chưa phản hồi cho lịch đặt này',
    code: "BOOKING_00005",
  },
  BOOKING_NOT_ACCEPTED: {
    message: 'Lịch đặt chưa được chấp nhận',
    code: "BOOKING_00006",
  },
  ASSIGNMENT_DUPLICATE_SCHEDULE: {
    message: 'Thời gian làm việc đã trùng lịch với lịch khác',
    code: "BOOKING_00007",
  }
};
