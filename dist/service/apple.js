// src/services/AppleService.ts
import Apple from "../model/apple.js";
export default class AppleService {
    constructor(initialAppleCount = 5) {
        this.apples = [];
        this.height = Number(process.env.CANVASHEIGHT) || 1000;
        this.width = Number(process.env.CANVASWIDTH) || 1000;
        this.apples = this.generateInitialApples(initialAppleCount); // Now returns an Apple[] array
    }
    // Create a new apple
    createApple() {
        const x = Math.random() * this.width; // Random position
        const y = Math.random() * this.height;
        const size = 2 + Math.random() * 4; // Random size between 2 and 6
        return new Apple(x, y, size);
    }
    // Generate initial apples and return the apples array
    generateInitialApples(count = 100) {
        const apples = [];
        for (let i = 0; i < count; i++) {
            apples.push(this.createApple());
        }
        return apples; // Return the array of apples
    }
    // Get all apples
    getApples() {
        return this.apples;
    }
    // Ensure apple count remains within limits
    maintainAppleCount() {
        const minApples = 500;
        const maxApples = Number(process.env.MAXAPPLECOUNT);
        // Maintain minimum apple count
        while (this.apples.length < minApples) {
            this.apples.push(this.createApple());
        }
        // Maintain maximum apple count
        if (this.apples.length > maxApples) {
            this.apples = this.apples.slice(0, maxApples);
        }
    }
}
//# sourceMappingURL=apple.js.map