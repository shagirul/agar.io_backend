import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import GameManager from "./controller/gamemanager.js";
import Player from "./model/player.js";
import PlayerService from "./service/player.js";
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
    origin: "http://localhost:5173", // Allow connections from the client URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow cookies if necessary
  },
});
const gameManager = new GameManager();
// Initialize the game
gameManager.initializeGame();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create player when a new user connects
  socket.on(SocketEvent.CreatePlayer, (name: string) => {
    const playerId = socket.id; // Use socket.id as the player ID
    const player = gameManager.addPlayer(playerId, name);

    // Emit the player data to the specific player (the one who connected)
    socket.emit(SocketEvent.PlayerCreated, player.getPlayerData());

    // Emit the current game state to the new player
    socket.emit(SocketEvent.GameState, gameManager.getGameState());

    // Broadcast the new game state to all players except the one who just joined
    socket.broadcast.emit(SocketEvent.GameState, gameManager.getGameState());
  });

  // Handle player movement updates
  socket.on(SocketEvent.UpdatePlayerPosition, (x: number, y: number) => {
    gameManager.updatePlayerPosition(socket.id, x, y);

    // Broadcast updated game state to all clients
    io.emit(SocketEvent.GameState, gameManager.getGameState());
  });

  // Handle player disconnection
  socket.on(SocketEvent.PlayerDisconnected, () => {
    console.log("A user disconnected:", socket.id);

    // Optionally, remove player from game state
    gameManager.removePlayer(socket.id);

    // Notify all other players about the disconnection
    // socket.broadcast.emit(SocketEvent.PlayerDisconnected, socket.id);
    io.emit(SocketEvent.GameState, gameManager.getGameState());
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
