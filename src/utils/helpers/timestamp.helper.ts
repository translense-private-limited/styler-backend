export const timestamp30MinAgo = () => new Date(Date.now() - 1 * 60 * 1000);

export const getTimestampAfterMinutes = () =>
  new Date(Date.now() + 1 * 60 * 1000);

export const getTimestampBeforeMinutes = () =>
  new Date(Date.now() - 1 * 60 * 1000);

export const convertToIst = (utcTime: Date) =>
  new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);

export const getIstTimestamp = () =>
  new Date(Date.now() + 5.5 * 60 * 60 * 1000);

export const convertToUtc = (istTimestamp: Date) =>
  new Date(istTimestamp.getTime() - 5.5 * 60 * 60 * 1000);

export function roundToNearest30Minutes(time: Date): Date {
  const roundedTime = new Date(time);
  const minutes = roundedTime.getMinutes();

  // Round minutes to the nearest 30-minute interval
  if (minutes < 45) {
    roundedTime.setMinutes(30, 0, 0); // Round to the half-hour
  } else {
    roundedTime.setMinutes(0, 0, 0); // Round up to the next hour
    roundedTime.setHours(roundedTime.getHours() + 1);
  }

  return roundedTime;
}