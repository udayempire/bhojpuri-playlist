"use client"
import { useEffect, useState } from "react";

const getOrdinalNum = (n: number) => {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
};

export const Clock = () => {
    const [time, setTime] = useState("");
    
    useEffect(() => {
        const updateTime = () => {
            const d = new Date();
            const dateStr = `${getOrdinalNum(d.getDate())} ${d.toLocaleDateString("en-US", { month: "short" })}`;
            const timeStr = d.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
            });
            setTime(`${dateStr}, ${timeStr}`);
        };
        
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    
    return <span>{time}</span>;
};