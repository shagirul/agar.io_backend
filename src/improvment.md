# Enhancing Code with SOLID Principles

---

### **S - Single Responsibility Principle**
Each class should have only one responsibility or reason to change.  

#### Observations:
- The `Room` class has too many responsibilities:
  - Manages players.
  - Manages apples.
  - Handles the game loop.

#### Improvements:
1. **Game Loop Separation**:  
   Extract the game loop logic from the `Room` class into a `GameLoop` class or service. This will make `Room` responsible only for maintaining state, while `GameLoop` handles periodic updates.

2. **Apple Collision Handling**:  
   Extract the apple collision logic into a dedicated service or utility class. For instance:
   ```typescript
   class CollisionService {
       static checkCellAppleCollision(cell: Cell, apple: Apple): boolean { /* ... */ }
   }
   ```

3. **Randomization Logic**:  
   Move the random color generation in `Room` to a utility or a dedicated service (e.g., `ColorService`).

---

### **O - Open/Closed Principle**
Classes should be open for extension but closed for modification.

#### Observations:
- The collision logic is hardcoded for apples in `checkForAppleCollision`. 
- `PlayerService` and `AppleService` might need extension if new entities or logic are introduced.

#### Improvements:
1. **Collision Handling Extension**:  
   Introduce a generic interface or base class for entities that can be collided with (e.g., `Collidable`):
   ```typescript
   interface Collidable {
       getPosition(): { x: number; y: number };
       getSize(): number;
   }
   ```
   Implement this interface in `Apple` and `Cell`.

2. **Strategy for Game Entity Management**:  
   Use a strategy pattern for managing different entity types (apples, players, etc.). For instance:
   ```typescript
   interface GameEntityManager<T> {
       addEntity(entity: T): void;
       removeEntity(entity: T): void;
       updateEntities(): void;
   }
   ```

---

### **L - Liskov Substitution Principle**
Subtypes should be substitutable for their base types.

#### Observations:
- The `Apple` and `Cell` classes could be generalized under a base class or interface for better polymorphism.
  
#### Improvements:
- Introduce a base class for entities with position and size:
  ```typescript
  abstract class GameObject {
      abstract position: { x: number; y: number };
      abstract size: number;
  }
  ```
  `Cell` and `Apple` can inherit from this base class.

---

### **I - Interface Segregation Principle**
Classes should not be forced to implement interfaces they do not use.

#### Observations:
- There are no explicit interfaces in the code. While this does not violate ISP directly, adding targeted interfaces would make responsibilities more explicit.

#### Improvements:
- Define interfaces like `Movable`, `Collidable`, or `Consumable` for different responsibilities:
  ```typescript
  interface Movable {
      move(target: Vector2D, deltaTime: number): void;
  }

  interface Collidable {
      isCollidingWith(entity: Collidable): boolean;
  }
  ```

---

### **D - Dependency Inversion Principle**
High-level modules should not depend on low-level modules but on abstractions.

#### Observations:
- `Room` directly depends on `PlayerService` and `AppleService`.
- The `GameLoop` (if implemented) would also depend on concrete implementations of entities.

#### Improvements:
1. **Use Dependency Injection (DI)**:  
   Pass `PlayerService` and `AppleService` as dependencies to `Room` via the constructor. This allows you to inject mocks or alternate implementations for testing or future enhancements.

2. **Service Interfaces**:  
   Define interfaces for services (`IPlayerService`, `IAppleService`) and have the `Room` depend on these interfaces rather than concrete classes.

---

### Suggested Refactored Code
Here’s an example of how some parts can be refactored:

#### Apple Collision Service
```typescript
class CollisionService {
    static isColliding(entity1: Collidable, entity2: Collidable): boolean {
        const dx = entity1.position.x - entity2.position.x;
        const dy = entity1.position.y - entity2.position.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const combinedSize = entity1.size + entity2.size;
        return distance < combinedSize;
    }
}
```

#### Game Loop Refactor
```typescript
class GameLoop {
    private deltaTime: number = 0;
    private lastTime: number = Date.now();

    constructor(
        private room: Room,
        private playerService: PlayerService,
        private appleService: AppleService
    ) {}

    start(): void {
        setInterval(() => this.update(), GAME_LOOP_INTERVAL);
    }

    private update(): void {
        this.deltaTime = (Date.now() - this.lastTime) / 1000;
        this.lastTime = Date.now();

        this.playerService.getAllPlayers().forEach((player) => {
            player.move(this.deltaTime);
            player.getCells().forEach((cell) => {
                this.room.checkForAppleCollision(cell);
            });
        });

        this.appleService.maintainAppleCount();
    }
}
```

---
