'use strict';   // dont touch
const fs = require('fs');
var auth = require('./auth.js');
this.command = []; // dont touch
this.commandName = []; // dont touch
this.gamemodeId = []; // dont touch
this.gamemode = []; // dont touch
this.addToHelp = []; // dont touch

// [General]
this.name = "Auth"; // Name of plugin REQUIRED
this.author = "andrews54757"; // author REQUIRED
this.description = 'An auth plugin'; // Desciprtion
this.compatVersion = ''; // compatable with
this.version = '1.0.0'; // version REQUIRED

// [Extra Commands]
this.commandName[0] = "auth"; // plugin add-on command names
this.addToHelp[0] = "auth     : Auth plugin command"; // help command add-on (adds this string to the help command)
this.command[0] = require('./auth.js'); // extra command location

// [Extra Gamemodes]
this.gamemodeId[0] = ''; // gamemodeids of extra plugin gamemodes
this.gamemode[0] = ''; // gamemode location

// [Configs]
this.config = {
requirelogin: 0,
plugin: 1,
allowregister: 1,
}
this.configfile = 'config.ini'


// [Functions]
this.init = function (gameServer, config) {
  this.config = config;
  auth.init(plugin, gameServer);
  gameServer.beforespawn = function(player) {
    
    auth.beforespawn(player);
  };
  gameServer.beforeq = function(player) {
    return auth.beforeq(player);
    
  };
  gameServer.beforeeject = function(player) {return auth.beforeeject(player);};
  gameServer.beforesplit = function(player) {return auth.beforesplit(player);};
  gameServer.account = JSON.parse(fs.readFileSync('accounts.json'));
  gameServer.auon = this.config.plugin;
  console.log("[Auth] Auth loaded")
  // init, Used to do stuff such as overriding things


};

this.onSecond = function (gameServer) {
if (!this.up) this.up = 0;
if (this.up < 100) {
  this.up ++;
  
} else {
  this.up = 0;
  fs.writeFileSync('accounts.json', gameServer.account);
}

  // called every second
};


module.exports = this; // dont touch