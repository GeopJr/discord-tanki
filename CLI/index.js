const {
    Client
} = require('discord-rpc')
const snekfetch = require('snekfetch');
yaml = require('js-yaml');
fs = require('fs');


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const timer = ms => new Promise(res => setTimeout(res, ms));
try {

    var config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
    try {
        const rpc = new Client({
            transport: "ipc"
        }),
            appClient = "463793562639794176";

        async function checkforupdates() {
            const current_version = "1.9.0"
            const ress = await snekfetch.get('https://api.github.com/repos/GeopJr/discord-tanki/releases/latest');
            try {

                if ((ress.body.tag_name) == current_version) {
                    console.log(`Using latest version`)
                } else {
                    console.log(`Update Available: ` + (ress.body.name))
                }

            } catch (e) {
                console.log(`Error Checking for Updates`)
            }
        }
        checkforupdates();

        async function updatetanki() {
            const res = await snekfetch.get('https://ratings.tankionline.com/api/eu/profile/?user=' + (config.username));
            try {
                if ((res.body.response.hasPremium) == false) {

                    if ((res.body.response.rank) == 1) {
                        rank = 'Recruit'
                        rankimg = 'recruit'
                    } else if ((res.body.response.rank) == 2) {
                        rank = 'Private'
                        rankimg = 'private'
                    } else if ((res.body.response.rank) == 3) {
                        rank = "Gefreiter"
                        rankimg = "gefreiter"
                    } else if ((res.body.response.rank) == 4) {
                        rank = "Corporal"
                        rankimg = "corporal"
                    } else if ((res.body.response.rank) == 5) {
                        rank = "Master Corporal"
                        rankimg = "master_corporal"
                    } else if ((res.body.response.rank) == 6) {
                        rank = "Sergeant"
                        rankimg = "sergeant"
                    } else if ((res.body.response.rank) == 7) {
                        rank = "Staff Sergeant"
                        rankimg = "staff_sergeant"
                    } else if ((res.body.response.rank) == 8) {
                        rank = "Master Sergeant"
                        rankimg = "master_sergeant"
                    } else if ((res.body.response.rank) == 9) {
                        rank = "First Sergeant"
                        rankimg = "first_sergeant"
                    } else if ((res.body.response.rank) == 10) {
                        rank = "Sergeant Major"
                        rankimg = "sergeant_major"
                    } else if ((res.body.response.rank) == 11) {
                        rank = "Warrant Officer 1"
                        rankimg = "warrant_officer_1"
                    } else if ((res.body.response.rank) == 12) {
                        rank = "Warrant Officer 2"
                        rankimg = "warrant_officer_2"
                    } else if ((res.body.response.rank) == 13) {
                        rank = "Warrant Officer 3"
                        rankimg = "warrant_officer_3"
                    } else if ((res.body.response.rank) == 14) {
                        rank = "Warrant Officer 4"
                        rankimg = "warrant_officer_4"
                    } else if ((res.body.response.rank) == 15) {
                        rank = "Warrant Officer 5"
                        rankimg = "warrant_officer_5"
                    } else if ((res.body.response.rank) == 16) {
                        rank = "Third Lieutenant"
                        rankimg = "third_lieutenant"
                    } else if ((res.body.response.rank) == 17) {
                        rank = "Second Lieutenant"
                        rankimg = "second_lieutenant"
                    } else if ((res.body.response.rank) == 18) {
                        rank = "First Lieutenant"
                        rankimg = "first_lieutenant"
                    } else if ((res.body.response.rank) == 19) {
                        rank = "Captain"
                        rankimg = "captain"
                    } else if ((res.body.response.rank) == 20) {
                        rank = "Major"
                        rankimg = "major"
                    } else if ((res.body.response.rank) == 21) {
                        rank = "Lieutenant Colonel"
                        rankimg = "lieutenant_colonel"
                    } else if ((res.body.response.rank) == 22) {
                        rank = "Colonel"
                        rankimg = "colonel"
                    } else if ((res.body.response.rank) == 23) {
                        rank = "Brigadier"
                        rankimg = "brigadier"
                    } else if ((res.body.response.rank) == 24) {
                        rank = "Major General"
                        rankimg = "major_general"
                    } else if ((res.body.response.rank) == 25) {
                        rank = "Lieutenant General"
                        rankimg = "lieutenant_general"
                    } else if ((res.body.response.rank) == 26) {
                        rank = "General"
                        rankimg = "general"
                    } else if ((res.body.response.rank) == 27) {
                        rank = "Marshal"
                        rankimg = "marshal"
                    } else if ((res.body.response.rank) == 28) {
                        rank = "Field Marshal"
                        rankimg = "field_marshal"
                    } else if ((res.body.response.rank) == 29) {
                        rank = "Commander"
                        rankimg = "commander"
                    } else if ((res.body.response.rank) == 30) {
                        rank = "Generalissimo"
                        rankimg = "generalissimo"
                    } else if ((res.body.response.rank) > 31) {
                        rankimg = "legend"
                        numrank = (res.body.response.rank) - 30
                        rank = "Legend " + (numrank)
                    } else if ((res.body.response.rank) == 31) {
                        rank = "Legend 1"
                        rankimg = "legend"
                    }
                } else if ((res.body.response.hasPremium) == true) {
                    if ((res.body.response.rank) == 1) {
                        rank = 'Recruit'
                        rankimg = 'pre_recruit'
                    } else if ((res.body.response.rank) == 2) {
                        rank = 'Private'
                        rankimg = 'pre_private'
                    } else if ((res.body.response.rank) == 3) {
                        rank = "Gefreiter"
                        rankimg = "pre_gefreiter"
                    } else if ((res.body.response.rank) == 4) {
                        rank = "Corporal"
                        rankimg = "pre_corporal"
                    } else if ((res.body.response.rank) == 5) {
                        rank = "Master Corporal"
                        rankimg = "pre_master_corporal"
                    } else if ((res.body.response.rank) == 6) {
                        rank = "Sergeant"
                        rankimg = "pre_sergeant"
                    } else if ((res.body.response.rank) == 7) {
                        rank = "Staff Sergeant"
                        rankimg = "pre_staff_sergeant"
                    } else if ((res.body.response.rank) == 8) {
                        rank = "Master Sergeant"
                        rankimg = "pre_master_sergeant"
                    } else if ((res.body.response.rank) == 9) {
                        rank = "First Sergeant"
                        rankimg = "pre_first_sergeant"
                    } else if ((res.body.response.rank) == 10) {
                        rank = "Sergeant Major"
                        rankimg = "pre_sergeant_major"
                    } else if ((res.body.response.rank) == 11) {
                        rank = "Warrant Officer 1"
                        rankimg = "pre_warrant_officer_1"
                    } else if ((res.body.response.rank) == 12) {
                        rank = "Warrant Officer 2"
                        rankimg = "pre_warrant_officer_2"
                    } else if ((res.body.response.rank) == 13) {
                        rank = "Warrant Officer 3"
                        rankimg = "pre_warrant_officer_3"
                    } else if ((res.body.response.rank) == 14) {
                        rank = "Warrant Officer 4"
                        rankimg = "pre_warrant_officer_4"
                    } else if ((res.body.response.rank) == 15) {
                        rank = "Warrant Officer 5"
                        rankimg = "pre_warrant_officer_5"
                    } else if ((res.body.response.rank) == 16) {
                        rank = "Third Lieutenant"
                        rankimg = "pre_third_lieutenant"
                    } else if ((res.body.response.rank) == 17) {
                        rank = "Second Lieutenant"
                        rankimg = "pre_second_lieutenant"
                    } else if ((res.body.response.rank) == 18) {
                        rank = "First Lieutenant"
                        rankimg = "pre_first_lieutenant"
                    } else if ((res.body.response.rank) == 19) {
                        rank = "Captain"
                        rankimg = "pre_captain"
                    } else if ((res.body.response.rank) == 20) {
                        rank = "Major"
                        rankimg = "pre_major"
                    } else if ((res.body.response.rank) == 21) {
                        rank = "Lieutenant Colonel"
                        rankimg = "pre_lieutenant_colonel"
                    } else if ((res.body.response.rank) == 22) {
                        rank = "Colonel"
                        rankimg = "pre_colonel"
                    } else if ((res.body.response.rank) == 23) {
                        rank = "Brigadier"
                        rankimg = "pre_brigadier"
                    } else if ((res.body.response.rank) == 24) {
                        rank = "Major General"
                        rankimg = "pre_major_general"
                    } else if ((res.body.response.rank) == 25) {
                        rank = "Lieutenant General"
                        rankimg = "pre_lieutenant_general"
                    } else if ((res.body.response.rank) == 26) {
                        rank = "General"
                        rankimg = "pre_general"
                    } else if ((res.body.response.rank) == 27) {
                        rank = "Marshal"
                        rankimg = "pre_marshal"
                    } else if ((res.body.response.rank) == 28) {
                        rank = "Field Marshal"
                        rankimg = "pre_field_marshal"
                    } else if ((res.body.response.rank) == 29) {
                        rank = "Commander"
                        rankimg = "pre_commander"
                    } else if ((res.body.response.rank) == 30) {
                        rank = "Generalissimo"
                        rankimg = "pre_generalissimo"
                    } else if ((res.body.response.rank) > 31) {
                        rankimg = "pre_legend"
                        numrank = (res.body.response.rank) - 30
                        rank = "Legend " + (numrank)
                    } else if ((res.body.response.rank) == 31) {
                        rank = "Legend 1"
                        rankimg = "pre_legend"
                    }
                }

                kdratio = (res.body.response.kills) / (res.body.response.deaths)
                kdratioround = kdratio.toFixed(2)
                crys = (res.body.response.earnedCrystals).toLocaleString('en')
                golds = (res.body.response.caughtGolds).toLocaleString('en')
                kd = (kdratioround)
                expleft = (res.body.response.scoreNext) - (res.body.response.score)
                exp = (res.body.response.score).toLocaleString('en') + "/" + (res.body.response.scoreNext).toLocaleString('en')
                expleftcommas = (expleft).toLocaleString('en')
                tanname = (res.body.response.name)
                gss = (res.body.response.gearScore).toLocaleString('en')

                if ((config.mode) == "small") {
                    bigg = (config.logo)
                    smalll = (rankimg)
                    smallltexx = (rank)
                    biggtexx = "Tanki Online"
                    console.log(`Updated Tanki Info & config`);
                } else if ((config.mode) == "big") {
                    bigg = (rankimg)
                    smalll = (config.logo)
                    smallltexx = "Tanki Online"
                    biggtexx = (rank)
                    console.log(`Updated Tanki Info & config`);
                } else {
                    console.log(`\nUse small or big mode in config.yml\n`)
                    await timer(5000);
                    process.exit()
                };

                if ((config.logo) == "ice") {
                    foo = "bar"
                } else if ((config.logo) == "fire") {
                    foo = "bar"
                } else if ((config.logo) == "railgun") {
                    foo = "bar"
                } else if ((config.logo) == "normal") {
                    foo = "bar"
                } else {
                    console.log(`\nUse normal, fire, ice or railgun logo in config.yml\n`)
                    await timer(5000);
                    process.exit()
                };

            } catch (e) {
                console.log(`\nUser not found, check your username in config.yml!\n`)
                await timer(5000);
                process.exit()
            }
        }

        updatetanki();

        const startTimestamp = new Date();

        async function updatediscord() {
            const myArray = [
                `KD : ${kd}`,
                `Crystals : ${crys}`,
                `Golds : ${golds}`,
                `Exp Left : ${expleftcommas}`,
                `Exp : ${exp}`,
                `Rank : ${rank}`,
                `GS : ${gss}`
            ];

            const randomItem = myArray[Math.floor(Math.random() * myArray.length)];
            rpc.setActivity({
                details: `Nickname : ` + (tanname), //as mentioned by Blload
                state: (randomItem),
                startTimestamp,
                largeImageKey: (bigg),
                smallImageKey: (smalll),
                largeImageText: (biggtexx),
                smallImageText: (smallltexx),
                instance: false,
            });
        }

        rpc.on('ready', () => {
            console.log(`Connected to Discord! (${appClient})`);
            global.intloop = setInterval(updatetanki, 300000);
            global.intloop = setInterval(updatediscord, 15000);
        });

        rpc.login(appClient);
    } catch (ee) {
        console.log(ee)
        console.log("Send this to『Geop』#4066");
        console.log("Exiting...")
        setTimeout(function () { process.exit() }, 5000);
    }
} catch (e) {
    snekfetch.get('https://rawcdn.githack.com/GeopJr/discord-tanki/e8f4df821277af4a24b7df87b48a0a9455cc6d3f/config.yml')
        .pipe(fs.createWriteStream('config.yml')); // pipes
    async function ask() {
        console.log("Downloading Config.yml ...")
        await timer(3000);
        console.log("Done!\n")
        fs.readFile('./config.yml', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            rl.question('What is your tanki username?\n', (answer) => {
                var resultt = data.replace(/your_tanki_username/g, answer)
                console.log('Your username was set to:', answer);


                rl.question('\nWould you like big or small rank icon?\n(Answer either big or small)\n', (answerr) => {
                    var answerre = answerr.toLowerCase();
                    if ((answerre == "big") || (answerre == "small")) {
                        var resulttt = resultt.replace(/the_mode_you_want/g, answerre)
                        console.log('Your rank size was set to:', answerre);

                    } else {
                        console.log("You didn't input big or small, your input was:", answerre);
                        console.log('Try again!');
                        rl.pause()
                        fs.unlinkSync('./config.yml')
                        console.log("Exiting...")
                        function freeze(time) {
                            const stop = new Date().getTime() + time;
                            while (new Date().getTime() < stop);
                        }
                        freeze(5001);
                        process.exit()
                    }


                    rl.question('\nWould you like normal, fire, ice or railgun logo?\n(Answer either normal, fire, ice or railgun)\n', (answeer) => {
                        var answeerr = answeer.toLowerCase();
                        if (answeerr == "fire" || answeerr == "ice" || answeerr == "railgun" || answeerr == "normal") {
                            var resultttt = resulttt.replace(/the_logo_you_want/g, answeerr)
                            console.log('Your logo was set to:', answeerr);

                            // process.stdin.once('data', function () {
                            //   process.exit()
                            // });
                        } else {
                            console.log("You didn't input normal, fire, ice or railgun, your input was:", answeerr);
                            console.log('Try again!');
                            rl.pause()
                            fs.unlinkSync('./config.yml')
                            console.log("Exiting...")

                            function freeze(time) {
                                const stop = new Date().getTime() + time;
                                while (new Date().getTime() < stop);
                            }
                            freeze(5001);
                            process.exit()
                        }
                        fs.writeFile('./config.yml', resultttt, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                        console.log("\nconfig.yml got saved");
                        console.log("Don't delete it");
                        console.log("You can now relaunch it");
                        console.log("If you find any errors send them to『Geop』#4066");
                        setTimeout(function () { rl.close(); }, 5000);
                    });
                });
            });


        });
    }

    ask();
}