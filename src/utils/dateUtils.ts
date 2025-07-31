import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.locale('es');

export const formatDate = (date: Date | string, format: string = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: Date | string): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatRelativeTime = (date: Date | string): string => {
  return dayjs(date).fromNow();
};

export const isToday = (date: Date | string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isTomorrow = (date: Date | string): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

export const isThisWeek = (date: Date | string): boolean => {
  const startOfWeek = dayjs().startOf('week');
  const endOfWeek = dayjs().endOf('week');
  return dayjs(date).isBetween(startOfWeek, endOfWeek, 'day', '[]');
};

export const getDateFilterOptions = () => {
  return [
    { label: 'Hoy', value: 'today' },
    { label: 'Mañana', value: 'tomorrow' },
    { label: 'Esta Semana', value: 'this_week' },
    { label: 'Todos', value: 'all' },
  ];
};

export const getTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

export const getPreferredDateRange = (): { start: Date; end: Date } => {
  const start = dayjs().startOf('day').toDate();
  const end = dayjs().add(30, 'days').endOf('day').toDate();
  return { start, end };
};

export const formatTime = (date: Date | string): string => {
  return dayjs(date).format('HH:mm');
}; 