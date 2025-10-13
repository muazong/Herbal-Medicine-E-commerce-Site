import { ORDER_STATUS } from '../enums';

export const order_status_vi = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.SHIPPED]: 'Đã gửi',
  [ORDER_STATUS.DELIVERED]: 'Đã nhận',
  [ORDER_STATUS.CANCELLED]: 'Huỷ',
};
