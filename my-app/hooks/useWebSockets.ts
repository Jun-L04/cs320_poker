// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

export function useWebSocket(path: string | null, onMessage?: (data: any) => void) {
    const [players, setPlayers] = useState<string[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!path) return;

        const socket = new WebSocket(`wss://cs320-poker.onrender.com/ws/${path}`);
        socketRef.current = socket;

        // socket.onopen = () => {
        //     console.log("✅ WebSocket connected");
        //     socket.send("hi");
        // };

        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "update_players") {
                setPlayers(data.players);
            }

            if (onMessage) {
                onMessage(data);
            }
        };

        socket.onerror = (err) => {
            console.log("WebSocket error:", err);
        };

        socket.onclose = () => {
            console.log("Disconnected from WebSocket");
        };

        return () => {
            socket.close();
        };
    }, [path]);

    const sendMessage = (message: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn("🚫 WebSocket not open. Cannot send message.");
        }
    };

    return { players, sendMessage, socket: socketRef.current };
}
