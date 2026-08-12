import { createServer } from "http";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";

import {
    addClient,
    removeClient,
} from "./server/presence";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({
    dev,
    hostname,
    port,
});

async function startServer() {
    // IMPORTANT: prepare Next.js first
    await app.prepare();

    const handle = app.getRequestHandler();

    // Get upgrade handler ONLY after prepare()
    const upgradeHandler = app.getUpgradeHandler();

    const httpServer = createServer((req, res) => {
        handle(req, res);
    });

    const wss = new WebSocketServer({
        noServer: true,
    });

    httpServer.on("upgrade", (request, socket, head) => {
        const url = new URL(
            request.url || "/",
            `http://${request.headers.host}`,
        );

        console.log("WebSocket upgrade:", url.pathname);

        // Our presence WebSocket
        if (url.pathname === "/ws/presence") {
            wss.handleUpgrade(
                request,
                socket,
                head,
                (ws) => {
                    wss.emit("connection", ws, request);
                },
            );

            return;
        }

        // Let Next.js handle HMR
        upgradeHandler(request, socket, head);
    });

    wss.on("connection", (ws: WebSocket) => {
        console.log("Presence Connected");

        addClient(ws);
        ws.on("close", (code, reason) => {
            console.log("Presence Disconnected", {
                code,
                reason: reason.toString(),
            });

            removeClient(ws);
        });

        ws.on("error", (error) => {
            console.error(
                "Presence WebSocket error:",
                error,
            );
        });
    });

    httpServer.listen(port, hostname, () => {
        console.log(
            `> http://${hostname}:${port}`,
        );

        console.log(
            `> WebSocket ws://${hostname}:${port}/ws/presence`,
        );
    });
}

startServer().catch((error) => {
    console.error(error);
    process.exit(1);
});