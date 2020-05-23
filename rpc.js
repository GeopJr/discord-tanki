const DiscordRPC = require('discord-rpc');
const electronStore = require('electron-store');
const tankionline = require("tankionline.js");
const store = new electronStore();
const logger = require('./logger');
const startTimestamp = new Date();
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const clientId = "553324863243288576";
json = {};

async function updateTanki() {
    try {
        let ratings = new tankionline.ratings((store.get('name')), 'en');
        let data = await ratings.stats()
        let rankImage = data.rank.toLowerCase().startsWith("legend") ? "legend" : data.rank.toLowerCase().replace(/ /g, "_");
        rankImage = data.premium === "Yes" ? "pre_" + rankImage : rankImage;
        if ((store.get('size')) === "small") {
            big = (store.get('logo'))
            small = rankImage
            smallText = data.rank
            bigText = "Tanki Online"
        } else if ((store.get('size')) === "big") {
            big = rankImage
            small = (store.get('logo'))
            smallText = "Tanki Online"
            bigText = data.rank
        }
        logger.log(`Updated Tanki Info & config`)
        json = {
            name: data.name,
            kd: data.kd,
            kills: data.kills,
            deaths: data.deaths,
            crystals: data.crystals,
            golds: data.golds,
            exp: data.exp.expNow,
            expNext: data.exp.expNext,
            gs: data.gearScore,
            rank: data.rank,
            playtime: data.playtime,
            big: big,
            bigText: bigText,
            small: small,
            smallText: smallText
        }
        return true
    } catch (err) {
        logger.log(err)
    }
}

async function randomItem() {
    const stats = [
        `KD: ${json.kd}`,
        `Wins: ${json.deaths.toLocaleString("en")}`,
        `Deaths: ${json.deaths.toLocaleString("en")}`,
        `Playtime: ${json.playtime.hours.toLocaleString("en")}:${json.playtime.minutes}:${json.playtime.seconds}`,
        `Crystals: ${json.crystals.toLocaleString("en")}`,
        `Golds: ${json.golds.toLocaleString("en")}`,
        `Exp: ${json.exp.toLocaleString("en")} / ${json.expNext.toLocaleString("en")}`,
        `Rank: ${json.rank}`,
        `GS: ${json.gs.toLocaleString("en")}`
    ]
    return stats[Math.floor(Math.random() * stats.length)];
};
async function setActivity() {
    if (!rpc) return;
    rpc.setActivity({
        details: `Nickname: ` + json.name,
        state: await randomItem(),
        startTimestamp,
        largeImageKey: json.big,
        largeImageText: json.bigText,
        smallImageKey: json.small,
        smallImageText: json.smallText,
        instance: false,
    });
}

rpc.on('ready', async () => {
    await updateTanki()
    setActivity()
    setInterval(() => {
        updateTanki();
    }, 3e5);
    setInterval(() => {
        setActivity();
    }, 15e3);
});

rpc.login({ clientId }).catch(err => logger.log("Error", err));