"use client";
import React, { useEffect } from "react";
import { EmptyState } from "../(site)/components/EmptyState";
import clsx from "clsx";
import { getMessaging, getToken } from "firebase/messaging";
// import { messaging } from '../firebase';
import axios from "axios";
import { toast } from "react-hot-toast";
import { initializeApp } from "firebase/app";

export default function Users() {
  let app;
  let messaging: any;

  async function requestPermission() {
    if ("serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const deviceToken = await getToken(messaging, {
          vapidKey:
            "BMYdQVdiX8PmTmE_nUg-bMIcrcAvwnxdupO_t98N2kXinKt1yEwSphO5SOouARVzGsMhbJlnikvHWKT8MfGGMBM",
        });

        axios.post("/api/token", {
          token: deviceToken,
          notificationPermission: permission,
        });
      } else if (permission === "denied") {
        toast.error("You will not recieve any notification of new messages !");
      }
    }
  }

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyABdAM_bn42pxG3DpRq389e32HF9-2e7rE",
      authDomain: "medichat-6f109.firebaseapp.com",
      projectId: "medichat-6f109",
      storageBucket: "medichat-6f109.appspot.com",
      messagingSenderId: "331661391095",
      appId: "1:331661391095:web:60a8bfc1de442ff48f0ff2",
      measurementId: "G-905E4S2ZQS",
    };

    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    requestPermission();

    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "notifications" })
        .then(function (notificationPerm) {
          notificationPerm.onchange = async function () {
            if (notificationPerm.state === "granted") {
              return;
            } else if (notificationPerm.state === "denied") {
              toast.error(
                "You will not recieve any notification of new messages !"
              );
              axios.post("/api/token", {
                notificationPermission: notificationPerm.state,
              });
            }
          };
        });
    }
  }, []);

  return (
    <div className={clsx("h-full w-full hidden lg:pl-80 lg:block")}>
      <EmptyState />
    </div>
  );
}
