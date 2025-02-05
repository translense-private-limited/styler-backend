export enum CouponTypeEnum {
  /**
   * Can be used only once per user.
   * Example: "Get 20% off on your first visit!"
   */
  ONE_TIME = 'ONE_TIME',

  /**
   * Can be reused after a specified interval.
   * Example: "Get 10% off every month on your favorite service!"
   */
  AFTER_INTERVAL = 'AFTER_INTERVAL',

  /**
   * Can be used multiple times without restrictions within the validity period.
   * Example: "Flat ₹100 off on haircuts for the next 3 months!"
   */
  RECURRING = 'RECURRING',

  /**
   * Unlockable after a certain number of visits or spending amount.
   * Example: "Get ₹500 off after 5 visits!"
   */
  LOYALTY_BASED = 'LOYALTY_BASED',

  /**
   * Activated when a user refers a new customer.
   * Example: "Refer a friend & both get 20% off!"
   */
  REFERRAL = 'REFERRAL',

  /**
   * Valid only during specific seasonal or festival periods.
   * Example: "Diwali Special - 25% off on spa services!"
   */
  SEASONAL = 'SEASONAL',

  /**
   * Auto-applied for customers on their birthdays/anniversaries.
   * Example: "Happy Birthday! Enjoy a free hair spa."
   */
  BIRTHDAY_ANNIVERSARY = 'BIRTHDAY_ANNIVERSARY',

  /**
   * Discounts on newly launched services.
   * Example: "Introducing Nail Art! Get 30% off for the first month!"
   */
  NEW_SERVICE_PROMO = 'NEW_SERVICE_PROMO',
}
