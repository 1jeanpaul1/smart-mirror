var express = require("express");
var NodeHelper = require("node_helper");
var request = require("request");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("mime-types");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./testparser.db');
var personal_memories = [];

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		var self = this;
		this.personal_memories = [];
		this.db = new sqlite3.Database('./testparser.db');
		this.getData();
		console.log("Starting node helper for: " + this.name);
		this.setConfig();
		this.extraRoutes();

	},

	//Gets the memory_file and caption from the personalMemory2 table
		getData: function() {
			personal_memories = [];
			var today = new Date();
			var date = '%'+(today.getMonth()+1)+'-'+today.getDate()+'%';
			db.each("SELECT memory_file, caption FROM personalMemory2", function(err, row) {
				let memory = [];
				memory.push(row.memory_file);
				memory.push(row.caption);
				personal_memories.push(memory);
			});
		db.close();
	},

	//should put the the folder holding all the images/video files outside of this directory.
	// Inside the modules directory
	setConfig: function() {
		this.config = {};
		this.path_images = path.resolve(global.root_path + "/modules/memories");
	},

	socketNotificationReceived: function(notification, payload) {

	},


	extraRoutes: function() {
		var self = this;

		this.expressApp.get("/PersonalMemories/memories", function(req, res) {
			self.getMemories(req, res);
		});

		this.expressApp.use("/PersonalMemories/memories", express.static(self.path_images));
	},


	//sends the location where the files are stored and a message related to the file.
	getMemories: function(req, res) {
		var memories = personal_memories.map(function (data) {
			return {url: "/PersonalMemories/memories/" + data[0], message: data[1]
			}
		});
		res.send(memories)
	},
});
