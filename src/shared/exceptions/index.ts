import { commonHttpErrors } from "./common.exception"
import { userHttpErrors } from './user.exception'

export const ERROR = {
  ...commonHttpErrors,
  ...userHttpErrors
}
