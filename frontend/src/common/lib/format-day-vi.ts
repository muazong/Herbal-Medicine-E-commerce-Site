import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

export default function formatDayVi(date: Date | string, withTime = true) {
  const formatStr = withTime ? 'HH:mm - DD/MM/YYYY' : 'DD/MM/YYYY';
  return dayjs.utc(date).tz('Asia/Ho_Chi_Minh').format(formatStr);
}
