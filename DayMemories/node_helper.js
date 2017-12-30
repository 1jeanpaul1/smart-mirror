// THE PURPOSE FOR THIS NODE_HELPER IS TO QUERY THE DATABASE FOR MEMORIES THAT OCCURRED TODAY

let express = require("express");
let NodeHelper = require("node_helper");
let path = require("path");
let sqlite3 = require('sqlite3').verbose();
let today_memories = [];
let fs = require("fs");
let mime = require("mime-types");
let request = require("request");
let url = require("url");

module.exports = NodeHelper.create({
	start: function() {
		let self = this;
		self.today_memories = [];
		self.db = new sqlite3.Database('./testparser.db');
		self.getData();
		console.log("Starting node helper for: " + this.name);
		self.setConfig();
		self.extraRoutes();
		self.today = new Date();
		// self.test_date = '%11-20%';

	},

	/*
	 * Queries the memory table for memories whose date_taken field is equivalent to today's Month and Day
	 * returns: A list of lists of the memory's file_name as well as a message that tells the user how many years ago
	 * the memory was taken.
	 * Example output: [['file_name.mp4', '1 year ago today...'], ['file_name_2.mp4', '3 years ago today...']]
	 */
	getData: function() {
		today_memories = [];
		let today = new Date();
		let test_date = '%12-12%'; // for testing purposes
		let date = '%'+(today.getMonth()+1)+'-'+today.getDate()+'%';
		console.log("----------------");
		console.log(date);
		this.db.each("SELECT memory_file, date_taken FROM memory WHERE date_taken LIKE ?", [date],  function(err, row) {
			let memory = [];
			let old_date = new Date(row.date_taken);
			let years_since = today.getYear() - old_date.getYear();
			memory.push(row.memory_file);
			if (years_since > 1) {
				memory.push(years_since + ' years ago today...');
			} else {
				memory.push('1 year ago today...');
			}
			today_memories.push(memory);
		});
		this.db.close();
	},

	setConfig: function() {
		this.config = {};
		this.path_memories = path.resolve(global.root_path + "/modules/memories");
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {

	},

	// create routes for module manager.
	// receive request and send response
	extraRoutes: function() {
		let self = this;
		this.expressApp.get("/DayMemories/memories", function(req, res) {
			self.getMemoryData(req, res);
		});

		this.expressApp.use("/DayMemories/memories", express.static(self.path_memories));
	},

	/*
	 * If this.today is yesterday then the database must be queried again.
	 * This method also receives and sends data from and to the frontend
	 */
	getMemoryData: function(req, res) {
		if (this.today.getDate() != new Date().getDate()) {
			this.start()
		}
		let memoryData = today_memories.map(function (data) {
			return {url: "/DayMemories/memories/" + data[0], message: data[1]};
        });
		res.send(memoryData);
	},
});
