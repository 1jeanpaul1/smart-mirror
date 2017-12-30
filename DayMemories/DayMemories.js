
Module.register("DayMemories",{
	defaults: {
		opacity: 0.9,
		animationSpeed: 500,
		updateInterval: 5000,
		getInterval: 60000,
		maxWidth: "60%",
		maxHeight: "60%",
		retryDelay: 2500
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		let self = this;
		self.memories = [];
		self.loaded = false;
		self.today = new Date();

		// Schedule update timer.
		self.getMemories();
		setInterval(function() {
			self.updateDom(self.config.animationSpeed);
		}, self.config.updateInterval);

	},

	/*
	 * A GET request is made to the backend and gets memories from the database
	 */
	getMemories: function() {
		console.log("GET PHOTOS IS CALLED");
		let urlApHelper = "/DayMemories/memories";
		let self = this;
		let retry = true;
		let memoryRequest = new XMLHttpRequest();
		memoryRequest.open("GET", urlApHelper, true);
		memoryRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processMemory(JSON.parse(this.response));
					console.log(this.response);
					memoryRequest.abort()
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load photos.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		memoryRequest.send();
	},

	/*
	 * Schedules an update that calls the getPhotos Method
	 */
	scheduleUpdate: function(delay) {
		let nextLoad = this.config.getInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		let self = this;
		setTimeout(function() {
			self.getMemories();
		}, nextLoad);
	},


	/*
	 * Generates and returns a random index based on the the length of the list 'photos'.
	 */
	randomIndex: function(memories) {
		if (memories.length === 1) {
			return 0;
		}
		let generate = function() {
			return Math.floor(Math.random() * memories.length);
		};
		return generate();
	},

	/*
	 * Returns a Random Memory
	 */
	randomMemory: function() {
		let index = this.randomIndex(this.memories);
		return this.memories[index];
	},


	/*
	 * This is where the display is created. It displays a memory along with a message telling the how many years ago
	 * the displayed memory was captured
	 */
	getDom: function() {
		let newToday = new Date();
		if (this.today.getDate() != newToday.getDate()) {
			this.start()
		}
		let self = this;
		let previous_memory = document.getElementById('memory-div');
		if (previous_memory != null) {
            previous_memory.remove();
        }
		let wrapper = document.createElement("div");
		wrapper.id = 'memory-div';
		let memory = this.randomMemory();
		if (memory) {
			let date = document.createElement("P");
			date.style.fontSize = "medium";
			date.appendChild(document.createTextNode(memory.message)); //this should be however long it was... sql date stamp
			wrapper.appendChild(date);
			date.style.color = "white";
			if (memory && !memory.url.includes('mp4')) {
				let img = document.createElement("img");
				img.src = memory.url;
				img.id = "day-memories";
				img.style.maxWidth = this.config.maxWidth;
				img.style.maxHeight = this.config.maxHeight;
				img.style.opacity = self.config.opacity;
				wrapper.appendChild(img);
			} else {
				let video =  document.createElement("video");
					video.src = memory.url;
					video.autoplay = true;
					video.loop = true;
					video.id = "day-memories";
					video.style.maxWidth = this.config.maxWidth;
					video.style.maxHeight = this.config.maxHeight;
					video.style.sdfsdfopacity = self.config.opacity;
					video.playbackRate = 0.3;
					wrapper.appendChild(video);
			}
		} else {
			let loading = new Date();
			console.log(loading.getHours());
			console.log(loading.getMinutes());
			let date = document.createElement("P");
			date.style.fontSize = "medium";
			if (loading.getHours() == 0 && loading.getMinutes() == 0) {
			    date.appendChild(document.createTextNode("Loading..."));
            } else {
			    date.appendChild(document.createTextNode("No Memories were captured today :((("));
            }
			wrapper.appendChild(date);
			date.style.color = "white";
		}
		return wrapper;
	},

	//Optional: Can update the CSS if needed
	getScripts: function() {
		return ["DayMemories.css"]
	},

	processMemory: function(data) {
		let self = this;
		this.memories = data;
		if (this.loaded === false) {
			self.updateDom(self.config.animationSpeed) ;
		}
		this.loaded = true;
	},

});
