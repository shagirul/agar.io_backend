export var SocketEvent;
(function (SocketEvent) {
    SocketEvent["Connection"] = "connection";
    SocketEvent["PlayerCreated"] = "playerCreated";
    SocketEvent["CreatePlayer"] = "createPlayer";
    SocketEvent["UpdatePlayerPosition"] = "updatePlayerPosition";
    SocketEvent["GameState"] = "gameState";
    SocketEvent["PlayerDisconnected"] = "playerDisconnected";
    // Add more socket events as necessary
})(SocketEvent || (SocketEvent = {}));
//# sourceMappingURL=socketEvents.js.map