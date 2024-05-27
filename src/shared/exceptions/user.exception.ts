export const userHttpErrors = {
  WRONG_PHONE_OR_PASSWORD: {
    message: 'Sai số điện thoại hoặc mật khẩu',
    code: "USER_00001",
  },
  USER_NOT_EXIST: {
    message: 'Người dùng không tồn tại',
    code: 'USER_00002'
  },
  USER_EXISTED: {
    message: 'Người dùng đã tồn tại',
    code: 'USER_00003'
  },
  ADDRESS_NOT_EXIST: {
    message: 'Địa chỉ người dùng không tồn tại',
    code: 'USER_00004'
  },
  ADDRESS_DEFAULT_NOT_FOUND: {
    message: 'Địa chỉ mặc định không tồn tại',
    code: 'USER_00005'
  },
  INVALID_PASSWORD: {
    message: 'Mật khẩu không hợp lệ',
    code: 'USER_00006'
  },
  CANT_DELETE_ADDRESS_DEFAULT: {
    message: 'Không thể xóa địa chỉ mặc định',
    code: 'USER_00007'
  },
  ADDRESS_NOT_FOUND: {
    message: 'Địa chỉ không tồn tại',
    code: 'USER_00008'
  },
  USER_VERIFIED: {
    message: 'Người dùng đã được xác minh',
    code: "USER_00009"
  },
  REQUEST_PAYMENT_FAIL: {
    message: 'Yêu cầu nạp tiền thất bại',
    code: 'USER_00010'
  },
  PAYMENT_SUCCESS_FAIL: {
    message: 'Nạp tiền thất bại',
    code: 'USER_00011'
  },
  PROMOTION_CLAIMED: {
    message: 'Bạn đã nhận mã khuyến mãi này rồi',
    code: 'USER_00012'
  },
  KPAY_NOT_ENOUGH: {
    message: 'Số dư KPay không đủ',
    code: 'USER_00013'
  },
};
