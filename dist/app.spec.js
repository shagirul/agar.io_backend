import request from "supertest";
import { Server } from "http";
import { Server as SocketIO } from "socket.io";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import Player from "./model/player.js";
import { SocketEvents } from "./socketEvents.js";
import socketIOClient from "socket.io-client";
// Load environment variables from .env file
config({
    path: "./.env",
});
// Create a mock game manager for testing
jest.mock("./controller/gamemanager.js");
const mockGameManager = {
    initializeGame: jest.fn(),
    addPlayer: jest.fn(),
    updatePlayerPosition: jest.fn(),
    getGameState: jest.fn().mockReturnValue({ players: [], apples: [] }),
};
// Initialize the server for testing
const app = express();
const server = new Server(app);
const io = new SocketIO(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});
const gameManager = mockGameManager;
gameManager.initializeGame();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});
io.on(SocketEvents.CONNECTION, (socket) => {
    socket.on(SocketEvents.NEW_PLAYER, (playerData) => {
        const newPlayer = new Player(playerData.id, playerData.x, playerData.y, playerData.color, playerData.size);
        gameManager.addPlayer(newPlayer);
        io.emit(SocketEvents.GAME_STATE, gameManager.getGameState());
    });
    socket.on(SocketEvents.MOVE_PLAYER, (movementData) => {
        gameManager.updatePlayerPosition(movementData.id, movementData.x, movementData.y);
        io.emit(SocketEvents.GAME_STATE, gameManager.getGameState());
    });
    socket.on(SocketEvents.DISCONNECT, () => { });
});
beforeAll((done) => {
    server.listen(4000, done);
});
afterAll((done) => {
    server.close(done);
});
// Test the health check endpoint
describe("Health Check", () => {
    it("should return 200 OK on /health route", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
    });
});
// Test the socket connection and events
describe("Socket.io events", () => {
    let socket;
    beforeAll((done) => {
        socket = socketIOClient.connect("http://localhost:4000");
        socket.on("connect", done);
    });
    afterAll((done) => {
        socket.disconnect();
        done();
    });
    it("should emit a game state after a new player joins", (done) => {
        const playerData = {
            id: "player-1",
            x: 100,
            y: 100,
            color: "blue",
            size: 10,
        };
        socket.emit(SocketEvents.NEW_PLAYER, playerData);
        socket.on(SocketEvents.GAME_STATE, (gameState) => {
            expect(gameState.players.length).toBe(1); // Ensure a player is added
            expect(gameState.players[0].id).toBe("player-1");
            done();
        });
    });
    it("should update the game state when a player moves", (done) => {
        const movementData = {
            id: "player-1",
            x: 200,
            y: 200,
        };
        socket.emit(SocketEvents.MOVE_PLAYER, movementData);
        socket.on(SocketEvents.GAME_STATE, (gameState) => {
            expect(gameState.players[0].x).toBe(200);
            expect(gameState.players[0].y).toBe(200);
            done();
        });
    });
    it("should handle disconnecting player", (done) => {
        socket.on(SocketEvents.DISCONNECT, () => {
            console.log("Disconnected from server");
        });
        socket.disconnect();
        done();
    });
});
//# sourceMappingURL=app.spec.js.map