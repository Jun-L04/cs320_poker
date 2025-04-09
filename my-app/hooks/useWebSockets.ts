// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

export function useWebSocket(path: string | null) {
    const [players, setPlayers] = useState<string[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!path) {
            return;
        }
        const socket = new WebSocket(`wss://cs320-poker.onrender.com/ws/${path}`);
        socketRef.current = socket;

        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "update_players") {
                setPlayers(data.players);
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

    return { players };
}
