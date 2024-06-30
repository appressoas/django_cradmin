module.exports = {
  verbose: false,
  roots: ['<rootDir>/source/'],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/lib/"
  ],
  transform: {
    "\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ['/node_modules/(?!(sinon)/)'],
  // transformIgnorePatterns: ['/node_modules/(?!(sinon|module1|module2)/)'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ["<rootDir>/config/jest/test-setup.js"]
}
