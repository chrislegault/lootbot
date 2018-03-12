jest.mock("fs");
jest.mock("path");
jest.mock("discord-akairo");

jest.mock("../handlers", () => ({
  CommandHandler: jest.fn("CommandHandler"),
  InhibitorHandler: jest.fn("InhibtorHandler")
}));

jest.mock("../models", () => ({
  Settings: jest.fn("Settings")
}));

const { AkairoClient, SequelizeProvider } = require("discord-akairo");
const { CommandHandler, InhibitorHandler } = require("../handlers");
const Client = require("../client");

describe("client", () => {
  beforeEach(() => {
    SequelizeProvider.mockReturnValue({
      init: jest.fn("init")
    });

    this.client = new Client();
    this.client.akairoOptions = { test: true };
  });

  it("should configure properly", () => {
    expect(AkairoClient).toMatchSnapshot();
  });

  it("should register sequelize as settings provider", () => {
    expect(this.client.settings).toBe(SequelizeProvider.mock.instances[0]);
    expect(SequelizeProvider).toMatchSnapshot();
  });

  it("should create custom command handler", () => {
    this.client.build();
    expect(CommandHandler).toMatchSnapshot();
    expect(AkairoClient.prototype.build).toHaveBeenCalled();
  });

  it("should create custom inhibitor handler", () => {
    this.client.build();
    expect(InhibitorHandler).toMatchSnapshot();
    expect(AkairoClient.prototype.build).toHaveBeenCalled();
  });

  it("should log in properly", async () => {
    const token = "1234";
    await this.client.login(token);
    expect(this.client.settings.init).toHaveBeenCalled();
    expect(AkairoClient.prototype.login).toHaveBeenCalledWith(token);
  });
});
