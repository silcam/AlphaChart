module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["server", "client"],
  testPathIgnorePatterns: ["/node_modules/", "puppeteer"]
};
