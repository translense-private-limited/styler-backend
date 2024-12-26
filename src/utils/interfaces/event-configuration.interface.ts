export interface EventConfigurationInterface {
    targetUser: string[]; // An array of user types (e.g., ["admin", "customer"]) to whom notifications will be sent
    notificationTemplate: {
      title: string; // The template for the notification title (e.g., "Welcome, {{userName}}!")
      body: string;  // The template for the notification body (e.g., "Your order #{{orderId}} has been placed.")
    };
  }
  