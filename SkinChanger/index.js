'use strict'; // dont touch
const fs = require('fs');
this.command = []; // dont touch
this.commandName = []; // dont touch
this.gamemodeId = []; // dont touch
this.gamemode = []; // dont touch
this.addToHelp = []; // dont touch
this.addToHelp[1] = "Skin Changer (SC) - LegitSoulja";
this.addToHelp[2] = "sc [add,rem] [id]";
this.addToHelp[3] = "sc reset     : Reset added id list";
this.addToHelp[4] = "Skin <sc> available in game!.";
this.addToHelp[4] = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
// [General]
this.name = "SkinChanger"; // Name of plugin REQUIRED
this.author = "LegitSoulja"; // author REQUIRED
this.description = 'SkinChanger FTW!'; // Desciprtion
this.compatVersion = ''; // compatable with (optional)
this.version = '1.0.3'; // version REQUIRED
// [Commands]
this.commandName[1] = "sc";
this.command[1] = function(gameServer, split) {
    if (split.length >= 2) {
        var first = split[1].toLowerCase();
        switch (first) {
            case "add":
                if (!isNaN(split[2])) {
                    if (ids.indexOf(parseInt(split[2])) > -1) {
                        console.log("[SC] ID is already added.");
                        return true;
                    } else {
                        ids.push(parseInt(split[2]));
                        console.log("[SC] Added " + split[2]);
                        return true;
                    }
                } else {
                    console.log("[SC] Please give a valid ID.");
                    return true;
                }
                break;
            case "rem":
                if (!isNaN(split[2])) {
                    for (var i in ids) {
                        if (ids[i] === parseInt(split[2])) {
                            ids.splice(i, 1);
                            console.log("[SC] Removed " + split[2]);
                            return true;
                        }
                    }
                } else {
                    console.log("[SC] Please give a valid ID.");
                    return true;
                }
                break;
            case "reset":
                ids = [];
                console.log("[SC] All ID's was reset!.");
                return true;
            default:
                console.log("[SC] Usage: sc add [id]");
                console.log("[SC] Usage: sc rem [id]");
                console.log("[SC] Usage: sc reset");   
                return true;
        }
    } else {
        console.log("[SC] Usage: sc add [id]");
        console.log("[SC] Usage: sc rem [id]");
        console.log("[SC] Usage: sc reset");
        return true;
    }
};
this.config = {
    changeInterval: 1, // *60 in minutes. 1 minute default
    customSkins: 0, // false
    debug: 0, // false
    usersskin: 1
};
this.configfile = 'config.ini';
var ids = [];
var skins = [];
// [Functions]
this.init = function(gameServer, config) {
    this.gameServer = gameServer;
	if(typeof(gameServer.skinchanger) != 'undefined'){
		if(gameServer.skinchanger == true){
			return;
		}else{
			this.gameServer.skinChanger = true;
		}
	}
    this.config = config;
    this.live = true;
    if (parseInt(config.customSkins) === 0) {
        require('request')("http://play.ogarul.tk/skinlist.php", function(e,r,b){
            if(!e){
                if(b){
                    var split = b.split(/\r?\n/);
                    var count = 0;
                    for (var i in split) {
                        if(split[i] && split[i] != ""){
                            count++;
                            var skin = split[i].replace(".png", "");
                            skins.push(skin);
                        }
                    }
                    if(count > 10){ // there's more than 10 skins. Anything else ignore..
                        console.log("[SC] Loaded " + count + ", live updated skins");
                        randomSkin(gameServer,config);
                        return;
                    }else{
                        skins = [];
                        console.log("[SC] Failed to obtain live skins. Using skins.txt instead.c");
                        skinfile(gameServer, config);
                    }
                }else{
                    console.log("[SC] Could not get live skins. Using skins.txt instead.b");
					console.log(e + b);
                    skinfile(gameServer, config);
                }
            }else{
                console.log("[SC] Could not get live skins. Using skins.txt instead.a");
                skinfile(gameServer, config);
            }
        });
    } else {
        fs.readFile(__dirname + "/customskins.txt", 'utf8', function(e, d) {
            if (!e) {
                if (d && d != "") {
                    var split = d.split(/\r?\n/);
                    for (var i in split) {
                        skins.push(split[i]);
                    }
                    randomSkin(gameServer, config);
                } else {
                    console.log("[SC] customskins.txt file is empty. Please add skins.");
                    return;
                }
            } else {
                console.log("[SC] Could not find customskins.txt");
                return;
            }
        });
    }
};
this.beforespawn = function(player){
    var name = player.name;
    if(this.config.usersskin == 1){
        if(name.substr(0,1) == "<"){
            if(name.substr(0,4) == "<sc>"){
                if(ids.indexOf(player.pID) > -1){
                    return true;
                }else{
                    ids.push(player.pID);
                    return true;
                }
                return true;
            }
            return true;
        }
        return true;
    }
    return true;
};
var skinfile = function (gameServer, config) {
    fs.readFile(__dirname + "/skins.txt", 'utf8', function (e, d) {
        if (!e) {
            if (d) {
                var split = d.split(/\r?\n/);
                for (var i in split) {
                    skins.push(split[i]);
                }
                randomSkin(gameServer, config);
            } else {
                console.log("[SC] skins.txt file is empty. Please add skins.");
                return;
            }
        } else {
            console.log("[SC] Could not find skins.txt");
            return;
        }
    });
};
var randomSkin = function(gameServer, config) {
    setInterval(function() {
        if (gameServer.running) {
            for (var p = 0; p < ids.length; p++) {
                var rskin = Math.floor((Math.random() * skins.length) + 0);
                for (var c = 0; c < gameServer.clients.length; c++) {
                    var client = gameServer.clients[c].playerTracker;
                    if (client.pID === ids[p]) {
                        client.premium = "%" + skins[rskin];
                        if (config.debug == 1) {
                            console.log("[SC] " + client.pID + " Was given the skin " + skins[rskin]);
                        }
                    }
                }
            }
        }
    }, parseInt(config.changeInterval) * 1000); // minutes..
};
module.exports = this; // dont touch
