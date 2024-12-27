// import GameManager from "../controller/gamemanager.js";
// import Apple from "../model/apple.js";
// import Player from "../model/player.js";
export {};
// describe("GameManager", () => {
//   let gameManager: GameManager;
//   beforeEach(() => {
//     gameManager = new GameManager();
//     gameManager.initializeGame(); // Initialize game state
//   });
//   it("should initialize the game with apples", () => {
//     const gameState = gameManager.getGameState();
//     expect(gameState.apples.length).toBeGreaterThan(0); // Ensure apples are created
//   });
//   it("should add a player successfully", () => {
//     const player = new Player("player1", 100, 200, "blue", 10);
//     gameManager.addPlayer(player);
//     const gameState = gameManager.getGameState();
//     expect(gameState.players.length).toBe(1);
//     expect(gameState.players[0]).toEqual(player); // Verify the added player
//   });
//   it("should update player position correctly", () => {
//     const player = new Player("player1", 0, 0, "green", 10);
//     gameManager.addPlayer(player);
//     gameManager.updatePlayerPosition("player1", 50, 50);
//     const gameState = gameManager.getGameState();
//     const updatedPlayer = gameState.players.find(
//       (p) => p.getId() === "player1"
//     );
//     expect(updatedPlayer?.position).toEqual({ x: 50, y: 50 }); // Verify position update
//   });
//   it("should handle player-apple collision", () => {
//     const player = new Player("player1", 100, 100, "red", 10);
//     gameManager.addPlayer(player);
//     const apple = new Apple(100, 100, 5); // Place apple at the same position as player
//     gameManager.getGameState().apples.push(apple);
//     gameManager.updatePlayerPosition("player1", 100, 100); // Trigger collision
//     const gameState = gameManager.getGameState();
//     const updatedPlayer = gameState.players.find(
//       (p) => p.getId() === "player1"
//     );
//     expect(updatedPlayer?.playerSize).toBe(15); // Player size should increase
//     expect(gameState.apples.length).toBeGreaterThan(1); // New apple should be spawned
//   });
//   it("should not trigger collision if player is far from apples", () => {
//     const player = new Player("player1", 0, 0, "yellow", 10);
//     gameManager.addPlayer(player);
//     const apple = new Apple(100, 100, 5); // Apple far from player
//     gameManager.getGameState().apples.push(apple);
//     gameManager.updatePlayerPosition("player1", 10, 10); // No collision expected
//     const gameState = gameManager.getGameState();
//     const updatedPlayer = gameState.players.find(
//       (p) => p.getId() === "player1"
//     );
//     expect(updatedPlayer?.playerSize).toBe(10); // Size remains unchanged
//     expect(gameState.apples.length).toBeGreaterThan(0); // No apple removed
//   });
//   it("should retrieve the correct game state", () => {
//     const player1 = new Player("player1", 0, 0, "blue", 10);
//     const player2 = new Player("player2", 100, 100, "red", 10);
//     gameManager.addPlayer(player1);
//     gameManager.addPlayer(player2);
//     const gameState = gameManager.getGameState();
//     expect(gameState.players.length).toBe(2); // Verify players count
//     expect(gameState.apples.length).toBeGreaterThan(0); // Verify apples are present
//   });
//   it("should maintain a valid number of apples", () => {
//     // Simulate some changes to apple count
//     gameManager.getGameState().apples.splice(0, 3); // Remove some apples
//     gameManager.getGameState().apples.push(new Apple(0, 0, 3)); // Add extra apple
//     // Update apple count
//     gameManager["appleService"].maintainAppleCount();
//     const gameState = gameManager.getGameState();
//     expect(gameState.apples.length).toBeLessThanOrEqual(10); // Should not exceed max
//     expect(gameState.apples.length).toBeGreaterThanOrEqual(5); // Should maintain min
//   });
// });
//# sourceMappingURL=GameManager.spec.js.map