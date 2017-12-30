var express = require("express");
var NodeHelper = require("node_helper");
var request = require("request");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("mime-types");
var sqlite3 = require('sqlite3').verbose();
var today_memories = [];
var db = new sqlite3.Database('./testparser.db');


module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		var self = this;
		this.today_memories = [];
		this.db = new sqlite3.Database('./testparser.db');
		this.getData();
		console.log("Starting node helper for: " + this.name);
		this.setConfig();
		this.extraRoutes();


	},
	getData: function() {
		// db.serialize(function() {
			today_memories = [];
			var today = new Date();
			var date = '%'+(today.getMonth()+1)+'-'+today.getDate()+'%';
			db.each("SELECT memory_file, date_taken FROM memory WHERE date_taken LIKE ?", [date],  function(err, row) {
				let memory = [];
				var old_date = new Date(row.date_taken);
				let years_since = today.getYear() - old_date.getYear();
				memory.push(row.memory_file);
				if (years_since > 1) {
					memory.push(years_since + ' year ago today...');
					}
					today_memories.push(memory);
			});
		db.close();
	},

	setConfig: function() {
		this.config = {};
		this.path_images = path.resolve(global.root_path + "/modules/memories");
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {

	},

	// create routes for module manager.
	// recive request and send response
	extraRoutes: function() {
		var self = this;

		this.expressApp.get("/DayMemories/photos", function(req, res) {
			self.getPhotosImages(req, res);
		});

		this.expressApp.use("/DayMemories/photo", express.static(self.path_images));
	},

	getPhotosImages: function(req, res) {
		var imagesPhotos = today_memories.map(function (data) {
			return {url: "/DayMemories/photo/" + data[0], message: data[1]};
        });
		res.send(imagesPhotos);
	},

	// return array with only images
	// getImages: function(files) {
	// 	var images = [];
	// 	var enabledTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
	// 	// var enabledTypes = ["video/mp4"];
	// 	for (idx in files) {
	// 		// console.log("THE FILES FORMAT THAT I NEED FOR DATABASE:");
	// 		// console.log(files[idx]);
    //
	// 		type = mime.lookup(files[idx]);
	// 		if (enabledTypes.indexOf(type) >= 0 && type !== false) {
	// 		images.push(files[idx]);
	// 		}
	// 	}
	// 	return images;
	// },

	// getFiles: function(path) {
	// 	return fs.readdirSync(path).filter(function (file) {
	// 		if (! fs.statSync(path + "/" + file).isDirectory() ) {
	// 			// console.log("GET FILES!!!!!!!!");
	// 			// console.log(file);
	// 			return file;
	// 		}
	// 	});
	// },

});
