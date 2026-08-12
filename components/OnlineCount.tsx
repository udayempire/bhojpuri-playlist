"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function OnlineCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const channel = pusher.subscribe("presence-bhojpuri");

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      setCount(members.count);
    });

    channel.bind("pusher:member_added", () => {
      setCount((channel as any).members.count);
    });

    channel.bind("pusher:member_removed", () => {
      setCount((channel as any).members.count);
    });

    return () => {
      pusher.unsubscribe("presence-bhojpuri");
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

      <span className="text-white">
        {count} Online
      </span>
    </div>
  );
}