"use client"
import { useEffect, useState } from "react";

export const Clock = () => {
    const [time, setTime] = useState("");
    useEffect(() => {
        const updateTime = () => {
            setTime(
                new Date().toLocaleDateString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    return <span>{time}</span>;
};