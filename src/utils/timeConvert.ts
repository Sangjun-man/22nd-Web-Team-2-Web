import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

export function formatDate(dateStr: string | Date) {
  const date = moment(dateStr, 'YYYY-MM-DD');
  return date.format('D일 dddd');
}

export function isDatePast(dateStr: string | Date) {
  const now = moment();
  const eventDate = moment(dateStr, 'YYYY-MM-DD');
  return eventDate.isBefore(now, 'day');
}

export function pmamConvert(time: string | Date) {
  const convertedTime = moment(time, 'HH:mm');
  const formattedTime =
    convertedTime.minute() === 0
      ? convertedTime.format('A h시')
      : convertedTime.format('A h시 m분');
  return formattedTime.replace('PM', '오후').replace('AM', '오전');
}

export function getDuration(
  startTimeStr: string | Date,
  endTimeStr: string | Date
) {
  const start = moment(startTimeStr, 'HH:mm');
  const end = moment(endTimeStr, 'HH:mm');
  const hours = end.diff(start, 'hours');
  const minutes = end.subtract(hours, 'hours').diff(start, 'minutes');

  const formattedDuration =
    minutes !== 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
  return formattedDuration;
}
