import { commonHttpErrors } from "./common.exception"
import { userHttpErrors } from './user.exception'
import { serviceHttpErrors } from './service.exception'

export const ERROR = {
  ...commonHttpErrors,
  ...userHttpErrors,
  ...serviceHttpErrors
}
