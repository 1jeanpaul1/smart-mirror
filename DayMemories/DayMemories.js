
Module.register("DayMemories",{
	defaults: {
		opacity: 0.9,
		animationSpeed: 500,
		updateInterval: 5000,
		getInterval: 60000,
		maxWidth: "50%",
		maxHeight: "50%",
		retryDelay: 2500
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		this.photos = [];
		this.loaded = false;
		this.lastPhotoIndex = -1;
		this.today = new Date();

		// Schedule update timer.
		this.getPhotos();
		setInterval(function() {
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);

	},

	//GET PHOTOS COMPLETE
	/*
	 * getPhotos
	 * Requests new data from api url helper
	 *
	 */
	getPhotos: function() {
		var urlApHelper = "/DayMemories/photos";
		var self = this;
		var retry = true;

		var photosRequest = new XMLHttpRequest();
		photosRequest.open("GET", urlApHelper, true);

		photosRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processPhotos(JSON.parse(this.response));

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
		photosRequest.send();
	},


	//MEMORY COMPLETE
	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.getInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getPhotos();
		}, nextLoad);
	},


	/* randomIndex(photos)
	 * Generate a random index for a list of photos.
	 *
	 * argument photos Array<String> - Array with photos.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(photos) {
		if (photos.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * photos.length);
		};

		var photoIndex = generate();
		this.lastPhotoIndex = photoIndex;

		return photoIndex;
	},

	/* complimentArray()
	 * Retrieve a random photos.
	 *
	 * return photo Object - A photo.
	 */
	randomPhoto: function() {
		var photos = this.photos;
		var index = this.randomIndex(photos);

		return photos[index];
	},


	getDom: function() {
		var newToday = new Date();
		if (this.today.getDate() != newToday.getDate()) {
			this.getPhotos()
		}
		var self = this;
		var wrapper = document.createElement("div");
		var photoImage = this.randomPhoto();
		// print("THE PHOTO IMAGE IEAN PAUL****");
		// print(photoImage);
		console.log("THE PHOTO IMAGE JEAN PAUL");
		console.log(photoImage);
		if (photoImage) {
			var date = document.createElement("P");
			date.style.fontSize = "medium";
			date.appendChild(document.createTextNode(photoImage.message)); //this should be however long it was... sql date stamp
			wrapper.appendChild(date);
			date.style.color = "white";
			if (photoImage && !photoImage.url.includes('mp4')) {
				var img = document.createElement("img");
				img.src = photoImage.url;
				img.id = "day-images-photos";
				img.style.maxWidth = this.config.maxWidth;
				img.style.maxHeight = this.config.maxHeight;
				img.style.opacity = self.config.opacity;
				wrapper.appendChild(img);
			} else {
				var video =  document.createElement("video");
					console.log("JEAN PAUL TORRE URL");
					console.log(photoImage.url);
					video.src = photoImage.url;
					video.autoplay = true;
					video.loop = false;
					video.id = "day-images-videos";
					video.style.maxWidth = this.config.maxWidth;
					video.style.maxHeight = this.config.maxHeight;
					video.style.opacity = self.config.opacity;
					video.playbackRate = 0.3;
					wrapper.appendChild(video);
			}
		}

		return wrapper;
	},

	getScripts: function() {
		return ["DayMemories.css"]
	},

	processPhotos: function(data) {
		var self = this;
		this.photos = data;
		console.log("----------DATA----------");
		console.log(data);
		if (this.loaded === false) {
			self.updateDom(self.config.animationSpeed) ;
		}
		this.loaded = true;
	},

});
