"use server";

import { pusherServer } from "../libs/pusher";

export const testPusher = async (msg: string) => {
  try {
    const response = await pusherServer.trigger(
      "amirfarooq55335@gmail.com",
      "testing",
      msg
    );
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};
