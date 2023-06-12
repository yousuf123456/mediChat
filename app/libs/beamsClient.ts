import * as PusherPushNotifications from "@pusher/push-notifications-web";

import PushNotifications from "@pusher/push-notifications-server";

export const beamsClient = new PushNotifications({
    instanceId : "9b399d99-0617-4a35-b047-d496fc3e201b",
    secretKey : "57C0592EDEE7C4DB2E020C0AB7523F1FAD97021368365A6EFAA0E05684CBFD4C"
})
