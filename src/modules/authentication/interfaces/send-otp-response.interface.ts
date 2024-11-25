export interface SendOtpResponseInterface {
  /**
   * Confirmation message for the OTP request.
   */
  message: string;

  /**
   * The recipient to whom the OTP was sent (email or contact number).
   */
  recipient: string;

  /**
   * The time in seconds before the OTP expires.
   */
  expiresIn: number;
}
