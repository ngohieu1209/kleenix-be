import { commonHttpErrors } from "./common.exception"
import { userHttpErrors } from './user.exception'
import { serviceHttpErrors } from './service.exception'
import { bookingHttpErrors } from "./booking.exception"
import { promotionHttpErrors } from "./promotion.exception"

export const ERROR = {
  ...commonHttpErrors,
  ...userHttpErrors,
  ...serviceHttpErrors,
  ...bookingHttpErrors,
  ...promotionHttpErrors,
}
