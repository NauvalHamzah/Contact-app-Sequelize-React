module.exports = {
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom/dist/index.js",
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
  };