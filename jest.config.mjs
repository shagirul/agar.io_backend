export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Remove .js extension from imports
  },
};
