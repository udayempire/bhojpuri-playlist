import { WebSocket } from "ws";

const clients = new Set<WebSocket>();

export function addClient(ws: WebSocket) {
    clients.add(ws);

    console.log("Client added. Online:", clients.size);

    broadcastCount();
}

export function removeClient(ws: WebSocket) {
    clients.delete(ws);

    console.log("Client removed. Online:", clients.size);

    broadcastCount();
}

export function broadcastCount() {
    const message = JSON.stringify({
        type: "online_count",
        count: clients.size,
    });

    console.log("Broadcasting:", clients.size);

    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}