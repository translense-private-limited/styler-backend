export const timestamp30MinAgo = (): Date =>
  new Date(Date.now() - 1 * 60 * 1000);

export const getTimestampAfterMinutes = (): Date =>
  new Date(Date.now() + 1 * 60 * 1000);

export const getTimestampBeforeMinutes = (): Date =>
  new Date(Date.now() - 1 * 60 * 1000);

export const convertToIst = (utcTime: Date): Date =>
  new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);

export const getIstTimestamp = (): Date =>
  new Date(Date.now() + 5.5 * 60 * 60 * 1000);

// export const convertToUtc = (istTimestamp: Date): Date =>
//   new Date(istTimestamp.getTime() - 5.5 * 60 * 60 * 1000);
export function convertToUtc(date: Date | string): Date {
  // Ensure the input is a valid Date object
  const inputDate = new Date(date);

  if (isNaN(inputDate.getTime())) {
    throw new Error('Invalid Date input');
  }

  // Convert to UTC by using toISOString(), which converts to UTC format
  const utcDate =  new Date(inputDate.getTime() - 5.5 * 60 * 60 * 1000);


  return utcDate;
}

