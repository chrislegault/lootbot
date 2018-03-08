module.exports = {
  coverageDirectory: "./coverage/",
  collectCoverageFrom: ["src/**/*.js"],
  resetMocks: true,
  restoreMocks: true,
  testEnvironment: "node",
  timers: "fake"
};
