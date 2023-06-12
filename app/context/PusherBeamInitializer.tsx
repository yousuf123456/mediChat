
import * as PusherPushNotifications from "@pusher/push-notifications-web";

import React, { useEffect } from 'react'

export const PusherBeamInitializer = () => {
    useEffect(()=>{
        const beamsClient = new PusherPushNotifications.Client({
            instanceId: "9b399d99-0617-4a35-b047-d496fc3e201b",
          });
          
        beamsClient
        .start()
        .then(() => beamsClient.addDeviceInterest("hello"))
        .then(()=> beamsClient.getDeviceInterests())
        .then((interests) => console.log("Interests : ", interests))
        .catch(console.error);
    }, [])

  return (
    null
  )
}

