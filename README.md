# Lootbot

[![Build Status](https://travis-ci.org/astraldragon/lootbot.svg?branch=master)](https://travis-ci.org/astraldragon/lootbot)
[![codecov](https://codecov.io/gh/astraldragon/lootbot/branch/master/graph/badge.svg)](https://codecov.io/gh/astraldragon/lootbot)
[![david](https://david-dm.org/astraldragon/lootbot.svg)](https://david-dm.org/astraldragon/lootbot)
[![david-dev](https://david-dm.org/astraldragon/lootbot/dev-status.svg)](https://david-dm.org/wopian/hibari?type=dev)

A discord bot for everyone's favorite video game feature...lootboxes! Manage and open lootboxes for users on your discord server.

# Prerequisites / Getting Started

- Latest Node
- Yarn
- Discord Bot User Account

## Create bot account

- [Create a bot user](https://discordapp.com/developers/applications/me)
- Click New App
- Give it a name and description
- Once bot is created, scroll down and click Create a Bot User
- Click link next to token to get the bot token
- Make note of the token ( we will need it)
- [Add bot to your server](https://discordapp.com/developers/docs/topics/oauth2#bot-authorization-flow)
- Get your user id in discord
- Optionally get your guild id

## Project setup

```bash
git clone https://github.com/astraldragon/lootbot
cd lootbot
```

Next create a .env file with the following format:
```
OWNER_ID=<your user id>
DISCORD_TOKEN=<bot token>
GUILD=<optional guild id>
```

Install dependencies and bootstrap the project
```bash
yarn # install dependencies
yarn migrate # create dev database
yarn seed # optional if you want to pre-seed some sample data, requires the GUILD option in .env or as an environment variable
yarn start # or yarn start:watch, starts the project
```

# Contributing

When contributing a feature or bug fix make sure to run the tests and stylechecks and you should be good to go!

```bash
yarn test # yarn test:watch, run the tests
yarn lint # yarn lint:fix, check codestyle
```

# License

Made available under the [MIT License](https://tldrlegal.com/license/mit-license)

