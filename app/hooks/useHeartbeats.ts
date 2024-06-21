import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useSingleFlight from "./useSingleFlight";
import { useEffect } from "react";

const HEARTBEAT_PERIOD = 5000;

export const useHeartbeat = (
  user: string,
  heartbeatPeriod = HEARTBEAT_PERIOD
) => {
  const heartbeat = useSingleFlight(useMutation(api.presence.heartbeat));

  useEffect(() => {
    const intervalId = setInterval(() => {
      void heartbeat({ user });
    }, heartbeatPeriod);
    // Whenever we have any data change, it will get cleared.
    return () => clearInterval(intervalId);
  }, [heartbeat, user, heartbeatPeriod]);
};
