/* Magic Mirror
 * Module: PersonalMemories
 *
 * By Jean Paul Torre
 */

Module.register("PersonalMemories",{

	defaults: {
		text: "PERSONAL MEMORIES WILL GO HERE!",
		repeats: 2,
		end_loop_message: "HAPPY 21st BIRTHDAY!!!",
		memory_1_size: "10%",
		memory_2_size: "15%",
		memory_3_size: "20%",
		memory_4_size: "15%",
		memory_5_size: "10%",
	},
//Initiated at the start of the program
	start: function() {
		let self = this;
		this.memories = [];
		this.loaded = false;
		this.testCount = 0;

		this.getMemories();
		setInterval(function() {
			self.updateDom(0);
		}, 5000);
	},

	//makes a GET request to get the memory files
	getMemories: function() {
		var urlApHelper = "/PersonalMemories/memories";
		var self = this;
		var retry = true;

		var memoryRequest = new XMLHttpRequest();
		memoryRequest.open("GET", urlApHelper, true);
		memoryRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
                if (this.status === 200) {
                    self.processMemory(JSON.parse(this.response));
                } else if (this.status === 401) {
                    self.updateDom(1000);
                    retry = false
                } else {
                }
                if (retry) {
					self.scheduleMemoryUpdate((self.loaded) ? -1 : 2500);
                }
            }
		};
		memoryRequest.send();
	},

	// Override dom generator.
	// The display is generated here
	getDom: function() {
		let wrapper = document.createElement("div");
		if (this.loaded) {
		let self = this;
		let videoSizes = [this.memory_1_size, this.memory_2_size, this.memory_3_size, this.memory_4_size,
			this.memory_5_size];
		let count = 0;
		if (this.testCount < this.memories.length * 2) {
			while (count < 5) {
			let testAgain = this.testCount % this.memories.length;
			try {
				if(this.memories[testAgain].url.includes('mp4')) {
					let wrapper1 = document.createElement("div");
					let video = document.createElement("video");
					video.src = this.memories[testAgain + count].url;
					video.style.maxWidth = videoSizes[count];
					video.style.maxHeight = videoSizes[count];
					video.autoplay = true;
					video.playbackRate = 0.3;
					wrapper1.appendChild(video);
					wrapper.appendChild(wrapper1);
				} else {
					let caption = document.createElement("P");
					caption.style.fontSize = "medium";
					caption.appendChild(document.createTextNode(this.memories[testAgain + count].message));
					let wrapper1 = document.createElement("div");
					wrapper1.appendChild(caption);
					let img = document.createElement("img");
					img.src = this.memories[testAgain + count].url;
					img.style.maxWidth = videoSizes[count];
					img.style.maxHeight = videoSizes[count];
					img.style.opacity = 0.9;
					wrapper1.appendChild(img);
					wrapper.appendChild(wrapper1);
				}
				count+=1;
			} catch(e) {
				this.testCount+=1
			}
		}
		this.testCount += 1;
		} else {
			this.testCount+=1
		}

		if (this.testCount == this.memories.length + 1 || this.testCount == this.memories.length + 2) {
			let happyBirthday = document.createElement("H1");
			happyBirthday.style.fontSize = "large";
			happyBirthday.appendChild(document.createTextNode(this.end_loop_message));
			wrapper.appendChild(happyBirthday)
		}
		}
		return wrapper;
	},


	scheduleMemoryUpdate: function (delay) {
		var nextLoad = 1000; //this is the interval that is put in. Idly it would be a set length for an image and the length of the video
    	if (typeof  delay !== "undefined" && delay >= 0) {
			nextLoad = delay
		}
		nextLoad = nextLoad;
		var self = this;
		setTimeout(function() {
			self.getMemories();
		}, nextLoad);
	},

	getScripts: function() {
		return["PersonalMemories.css"]
	},

	processMemory: function(data) {
		var self = this;
		this.memories = data;
		if (this.loaded === false) {
			self.updateDom(1000);
		}
		this.loaded = true
	}
});
