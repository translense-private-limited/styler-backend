import { toZonedTime } from 'date-fns-tz';

export function convertToUTC(localDate: Date): Date {
    return toZonedTime(localDate, 'UTC');
}