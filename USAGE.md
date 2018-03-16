# Bot Usage

When running commands the default prefixes are !lootbot or !lb.

When in doubt you can use the help command to get a listing of all the commands as well as specific usages. They will always contain the up to date usage information.

```bash
!lootbot help # list all commands
!lootbot help loot-list # help for specific commmand
```

## Permissions

By default the bot owner as well as users with Administrator privileges can run all commands regardless of permission configuration. For other users they must be assigned a role that has been configured to work with lootbot. The commands to add and remove roles are:

```bash
!lootbot permissions-add manage "Role Name"
!lootbot permissions-remove manage "Role Name"
```

Users with manage permissions can run all the commands of normal users + the commands to manage the data for tiers, loot and messages. Regular users can run no commands at this time.

## Tiers

Tiers are the core of lootbot. They are what dictate the win rates for loot. Loot is attached to a tier, and messages can optionally be attached to a tier. When a tier is removed all related loot and messages are also removed. Tiers have the following properties:

```
name - Name of the tier
color - Color that will be displayed when the loot of the tier is a winnner. Should be a hex code.
image - The image that will be displayed when the loot of the tier is a winner
weight - The normal odds of the tier
luckyWeight - The lucky odds of the tier
```

The weight is based on a relative weighted system.  If Tier 1 has a weight of 1 and Tier 2 has a weight of 3.  Tier 1 should win 25% of the time and Tier 2 should win 75% of the time.  If you have Tiers 1-4 each with a weight of 1.  They will each have a win rate of 25%.

luckyWeight is intended to have rates higher for the harder to win tiers.

To manage the tiers use the following commands:

```bash
!lootbot tier-list # list all the current tiers

!lootbot tier-add <name> <color> <image> <weight> <luckyWeight>
!lootbot tier-add Common #123456 path-to-image 1 10

!lootbot tier-update <existingName> name=<name> color=<color> image=<image> weight=<weight> luckyWeight=<luckyWeight> # all parameters with = are optional and can be added in any order
!lootbot tier-update Common weight=100

!lootbot tier-remove <name>
!lootbot tier-remove Common
```

## Loot

Loot is what is won when a lootbox is opened. They are attached to a tier. Loot has the following fields:

```
name - Name of the loot
tier - Name of the tier the loot belongs to
```

To manage the loot use the following commands:

```bash
!lootbot loot-list # list all the current loot

!lootbot loot-add <name> <tier>
!lootbot loot-add Pebble Common

!lootbot loot-update <existingName> name=<name> tier=<tier> # all parameters with = are optional and can be added in any order
!lootbot loot-update Pebble tier=Legendary name="Super Pebble"

!lootbot loot-remove <name>
!lootbot loot-remove "Super Pebble"
```

## Messages

Messages are what is said when the lootbot is opening loot. There are three different stages where a message is said in chat. They are intro, draw, and reward. Messages has the following fields:

```
name - id for a messaage (for updating and removing)
message - the message to be shown
type - stage at when the message should be used (intro, draw, reward)
delay - an optional delay until the next message is said, only used in intro and draw types
tier - the tier a message belongs to, currently only used in draw type but will be added to reward type soon
user - specific user to target a message at
```

Messages can contain special tokens that will be replaced with user, tier and loot data if provided. The format is as follows:

```bash
Congratulations <user>, you have won a <tier> prize named <reward>
```

`<user>` will be replaced with @user being mentioned, `<tier>` will replace with the tier name and `<reward>` will replace with the loot name.

To manage messages use the following commands:

```bash
!lootbot message-list # list all the current messages

!lootbot message-add <name> <message> <type> delay=<delay> tier=<tier> user=<user> # all paramters with = are optional and can be added in any order
!lootbot message-add msg1 "You won some loot!" draw delay=1000 tier=Common user=@user

!lootbot message-update <existingName> message=<message> type=<type> delay=<delay> tier=<tier> user=<user> # all paramters with = are optional and can be added in any order
!lootbot message-update msg1 message="Switch to an intro message" type=intro

!lootbot message-remove <name>
!lootbot message-remove msg1
```

## Opening Loot

Currently opening loot is restricted to bot owners, users with Administrator privileges or manage permissions. To open loot run the command:

```bash
!lootbot open @user
```

Only one game per channel can be active at a time. If a game is running, the open command will do nothing.

## Miscellaneous

In case of an emergency the bot can be stopped or started. While stopped only the bot owner and users with Administrator privileges can run commands. Those with manage permissions will not be able to run commands.

```bash
!lootbot disable # turns off all commands
!lootbot enable # turns on all commands
```
