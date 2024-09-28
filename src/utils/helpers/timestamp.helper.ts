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
