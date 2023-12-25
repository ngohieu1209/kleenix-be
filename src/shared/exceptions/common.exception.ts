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
  }
};
