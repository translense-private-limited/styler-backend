import { UserTypeEnum } from "@modules/authorization/enums/usertype.enum";

export interface EventInterface {
    id: string; 
    type: string; // Type of the event (e.g., "user_signup", "order_placed")
    identity: {
      userId: number; // The user ID associated with the event
      userType: UserTypeEnum; // The type of user (e.g., "admin", "customer")
    };
    data: Record<string, any>; // Any custom data related to the event (can be any shape)
  }
  