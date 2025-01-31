import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Room from "./model/room.js";
import { Vector2D } from "./utils/types.js";
// Uncomment if you want request logging
// import morgan from "morgan";

// Load environment variables from .env file
config({
  path: "./.env",
});
enum SocketEvent {
  Connection = "connection",
  PlayerCreated = "playerCreated",
  CreatePlayer = "createPlayer",
  Attack = "attack",
  UpdatePlayerPosition = "updatePlayerPosition",
  GameState = "gameState",
  PlayerDisconnected = "playerDisconnected",
  // Add more socket events as necessary
}

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not defined

const app = express();
const server = createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: ["http://localhost:5173", "https://agar-roan.vercel.app"], // Allow connections from the client URL
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if necessary
  },
});
const RoomManger = new Room();
// Initialize the game
RoomManger.initializeGame();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create player when a new user connects
  socket.on(SocketEvent.CreatePlayer, (name: string) => {
    const playerId = socket.id; // Use socket.id as the player ID
    const player = RoomManger.addPlayer(playerId, name);

    // Emit the player data to the specific player (the one who connected)
    socket.emit(SocketEvent.PlayerCreated, player.getPlayerData());

    // Emit the current game state to the new player
    socket.emit(SocketEvent.GameState, RoomManger.getGameState());

    // Broadcast the new game state to all players except the one who just joined
    socket.broadcast.emit(SocketEvent.GameState, RoomManger.getGameState());
  });

  // Handle player movement updates
  socket.on(SocketEvent.UpdatePlayerPosition, (direction: Vector2D) => {
    RoomManger.updatePlayerPosition(socket.id, direction);

    // Broadcast updated game state to all clients
    io.emit(SocketEvent.GameState, RoomManger.getGameState());
  });

  socket.on(SocketEvent.Attack, () => {
    // Optionally, remove player from game state
    RoomManger.attack(socket.id);

    // Notify all other players about the disconnection
    // socket.broadcast.emit(SocketEvent.PlayerDisconnected, socket.id);
    io.emit(SocketEvent.GameState, RoomManger.getGameState());
  });
  // Handle player disconnection
  socket.on(SocketEvent.PlayerDisconnected, () => {
    console.log("A user disconnected:", socket.id);

    // Optionally, remove player from game state
    RoomManger.removePlayer(socket.id);

    // Notify all other players about the disconnection
    // socket.broadcast.emit(SocketEvent.PlayerDisconnected, socket.id);
    io.emit(SocketEvent.GameState, RoomManger.getGameState());
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Start the server
server
  .listen(PORT, () => {
    console.log(`Server is working on port http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error(`Failed to start server: ${err.message}`);
  });
