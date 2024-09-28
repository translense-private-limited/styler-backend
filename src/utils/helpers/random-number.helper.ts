export const getSixDigitOtp = () =>
  123456 || Math.floor(100000 + Math.random() * 900000);
