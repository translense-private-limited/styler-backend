import { UserTypeEnum } from "@src/utils/enums/user-type.enum";
import { NotificationTypeEnum } from "@src/utils/notification/enums/notification-type.enum";

export const notificationConfig = {
    targetUser:[UserTypeEnum.CUSTOMER],
    targetClientRoles: [],
    notificationType: [NotificationTypeEnum.EMAIL, NotificationTypeEnum.SMS]
};
