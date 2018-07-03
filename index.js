const { Client } = require('discord-rpc')

var config = require("./config.json")

const rpc = new Client({ transport: "ipc" }),
    appClient = "463793562639794176";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
	
async function updatediscord() {
            rpc.setActivity({
                details: `Playing as ` + (config.username),
                state: `Rank : ` + (config.rank).capitalize().replace(/[_-]/g, " "),
                largeImageKey: `logo`,
                smallImageKey: (config.rank),
                largeImageText: `Tanki Online`,
                smallImageText: (config.rank),
                instance: false,
            });
        }

rpc.on('ready', () => {
    console.log(`Connected to Discord! (${appClient})`);
    global.intloop = setInterval(updatediscord, 1500);
});

rpc.login(appClient);
