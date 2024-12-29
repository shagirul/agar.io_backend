import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameManager } from "./core/GameManager.js";
import { Player } from "./core/player.js";
// Uncomment if you want request logging
// import morgan from "morgan";
// Load environment variables from .env file
config({
    path: "./.env",
});
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["Connection"] = "connection";
    SocketEvent["PlayerCreated"] = "playerCreated";
    SocketEvent["CreatePlayer"] = "createPlayer";
    SocketEvent["UpdatePlayerPosition"] = "updatePlayerPosition";
    SocketEvent["GameState"] = "gameState";
    SocketEvent["PlayerDisconnected"] = "playerDisconnected";
    // Add more socket events as necessary
})(SocketEvent || (SocketEvent = {}));
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not defined
const app = express();
const server = createServer(app);
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow connections from the client URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true, // Allow cookies if necessary
    },
});
const gameManager = new GameManager({ width: 1000, height: 1000 });
app.use(express.static("public"));
// Initialize the game
// Handle new client connection
io.on("connection", (socket) => {
    console.log(`New player connected: ${socket.id}`);
    const player = new Player(socket.id, `Player-${socket.id}`);
    const roomId = gameManager.addPlayerToRoom(player);
    socket.join(roomId);
    // Send initial state to the player
    socket.emit("update", gameManager.getRooms().get(roomId)?.gameLoop?.getDeltaUpdates());
    socket.on("move", (direction) => {
        gameManager.setPlayerDirection(socket.id, direction);
    });
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        gameManager.removePlayerFromRoom(socket.id);
    });
    setInterval(() => {
        gameManager.broadcastRoomStates(io);
    }, 1000 / 60); // 60 FPS updates
});
// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
//# sourceMappingURL=app.js.map