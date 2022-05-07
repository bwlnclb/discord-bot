const config = require("./config.json");
const Eris = require("eris");

const bot = new Eris.CommandClient(config.token, {
    restMode: true
}, {
    defaultHelpCommand: true,
    description: config.description,
    ignoreBots: true,
    ignoreSelf: true,
    name: config.name,
    owner: config.owner,
    prefix: config.prefix,
    defaultCommandOptions: {}
});

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}! (${bot.user.id})`);
});

bot.on("error", (err) => {
    console.error(err);
});

bot.registerCommand("ping", (msg) => {
    return msg.channel.createMessage(`Pong! ${msg.channel.guild.shard.latency}ms.`)
}, {
   description: "Shows the current latency of the bot.",
   fullDescription: "Shows the current latency of the bot."
});

bot.registerCommand("serverinfo", (msg) => {
    return msg.channel.createMessage({embed: {
        title: "Server Info",
        description: `**Name:** ${msg.channel.guild.name}\n**ID:** ${msg.channel.guild.id}\n**Owner:** <@!${msg.channel.guild.ownerID}>\n**Creation:** ${new Date(msg.channel.guild.createdAt).toLocaleString()}\n**Members:** ${msg.channel.guild.memberCount}\n**Channels:** ${msg.channel.guild.channels.size}`,
        color: 0x97C0E6
    }});
}, {
    description: "Shows information about the current server.",
    fullDescription: "Shows information about the current server."
});

bot.registerCommand("userinfo", async (msg) => {
    let target = await bot.getRESTGuildMember(msg.guildID, (msg.mentions[0] || msg.author).id)
    
    return msg.channel.createMessage({embed: {
        title: "User Info",
        description: `**Username:** ${target.username}#${target.discriminator}\n**ID:** ${target.id}\n**Creation:** ${new Date(target.createdAt).toLocaleString()}`,
        color: 0x97C0E6
    }});
}, {
    description: "Shows information about a user.",
    fullDescription: "Shows information about a user.",
    usage: "[mention]"
});

bot.registerCommand("kick", async (msg, args) => {
    try {
        await bot.kickGuildMember(msg.guildID, msg.mentions[0].id, args.slice(1).join(" "));
        return msg.channel.createMessage(`**${msg.mentions[0].username}** has been kicked from the server.`);
    } catch (error) {
        return msg.channel.createMessage(`There was an error attempting to kick **${msg.mentions[0].username}**.`);
    };
}, {
    argsRequired: true,
    description: "Kicks the provided user with an optional reason.",
    fullDescription: "Kicks the provided user with an optional reason.",
    requirements: {
        permissions: {
            "kickMembers": true
        },
    },
    usage: "<mention> [reason]"
});

bot.registerCommand("ban", async (msg, args) => {
    try {
        await bot.banGuildMember(msg.guildID, msg.mentions[0].id, 1, args.slice(1).join(" "));
        return msg.channel.createMessage(`**${msg.mentions[0].username}** has been banned from the server.`);
    } catch (error) {
        return msg.channel.createMessage(`There was an error attempting to ban **${msg.mentions[0].username}**.`);
    };
}, {
    argsRequired: true,
    description: "Bans the provided user with an optional reason.",
    fullDescription: "Bans the provided user with an optional reason.",
    requirements: {
        permissions: {
            "banMembers": true
        },
    },
    usage: "<mention> [reason]"
});

bot.registerCommand("silentban", async (msg, args) => {
    try {
        await bot.banGuildMember(msg.guildID, msg.mentions[0].id, 0, args.slice(1).join(" "));
        return msg.channel.createMessage(`**${msg.mentions[0].username}** has been banned from the server.`);
    } catch (error) {
        return msg.channel.createMessage(`There was an error attempting to ban **${msg.mentions[0].username}**.`);
    };
}, {
    argsRequired: true,
    description: "Identical to ``?ban`` but doesn't delete any messages.",
    fullDescription: "Identical to ``?ban`` but doesn't delete any messages.",
    requirements: {
        permissions: {
            "banMembers": true
        },
    },
    usage: "<mention> [reason]"
});

bot.registerCommand("unban", async (msg, args) => {
    try {
        await bot.unbanGuildMember(msg.guildID, args[0], args.slice(1).join(" "));
        return msg.channel.createMessage(`**${args[0]}** has been unbanned from the server.`);
    } catch (error) {
        return msg.channel.createMessage(`There was an error attempting to unban **${args[0]}**.`);
    };
}, {
    argsRequired: true,
    description: "Unbans the provided user with an optional reason.",
    fullDescription: "Unbans the provided user with an optional reason.",
    requirements: {
        permissions: {
            "banMembers": true
        },
    },
    usage: "<userID> [reason]"
});

bot.registerCommand("addrole", async (msg, args) => {
    try {
        await bot.addGuildMemberRole(msg.guildID, msg.mentions[0].id, args[1], args.slice(2).join(" "));
        return msg.channel.createMessage(`The provided role has been added to **${msg.mentions[0].username}**.`);
    } catch (error) {
        return msg.channel.createMessage(`There was an error attempting to add that role to **${msg.mentions[0].username}**.`);
    };
}, {
    argsRequired: true,
    description: "Adds a role to a provided user with an optional reason.",
    fullDescription: "Adds a role to a provided user with an optional reason.",
    requirements: {
        permissions: {
            "manageRoles": true
        },
    },
    usage: "<mention> <roleID> [reason]"
});

bot.registerCommand("removerole", async (msg, args) => {
    try {
        await bot.removeGuildMemberRole(msg.guildID, msg.mentions[0].id, args[1], args.slice(2).join(" "));
        return msg.channel.createMessage(`The provided role has been removed from **${msg.mentions[0].username}**.`);
    } catch (error) {
        return msg.channel.createMessage(`There was an error attempting to remove that role from **${msg.mentions[0].username}**.`);
    };
}, {
    argsRequired: true,
    description: "Removes a role from a provided user with an optional reason.",
    fullDescription: "Removes a role from a provided user with an optional reason.",
    requirements: {
        permissions: {
            "manageRoles": true
        },
    },
    usage: "<mention> <roleID> [reason]"
});

bot.connect();