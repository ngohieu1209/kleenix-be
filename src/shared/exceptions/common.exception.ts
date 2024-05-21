export const commonHttpErrors = {
  UNKNOWN_ERROR: {
    message: 'Internal Server Error',
    code: "ERROR_00000",
  },
  UNAUTHORIZED: {
    message: 'Unauthorized',
    code: "ERROR_00001",
  },
  FORBIDDEN: {
    message: 'Forbidden',
    code: "ERROR_00002",
  },
  TOO_MANY_REQUESTS: {
    message: 'Too Many Requests',
    code: "ERROR_00003",
  },
  REFRESH_TOKEN_FAIL: {
    message: 'Refresh Token Fail',
    code: "ERROR_00004",
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh Token Expired',
    code: "ERROR_00005",
  },
  REGISTER_FAIL: {
    message: 'Đăng kí thất bại',
    code: "ERROR_00006",
  },
  UPDATE_FAIL: {
    message: 'Cập nhật thất bại',
    code: 'ERROR_00007'
  },
  VERIFY_FAILED: {
    message: 'Xác thực thất bại',
    code: "ERROR_00008"
  },
  ACCOUNT_NOT_VERIFIED: {
    message: 'Tài khoản chưa được xác thực',
    code: "ERROR_00009"
  },
  PHONE_NUMBER_NOT_VERIFIED: {
    message: 'Số điện thoại chưa được xác minh',
    code: "ERROR_00010"
  },
  INVALID_VERIFY_CODE: {
    message: 'Mã xác minh không hợp lệ',
    code: "ERROR_00011"
  },
};
