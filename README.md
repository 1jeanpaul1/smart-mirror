# Smart Memory Mirror

**Inspiration:** My friend loves capturing memories in video (as can be seen by his youtube channel: https://www.youtube.com/user/TheTryHardTV). I wanted a way for him to see his memories. So I decided to create a Smart Mirror that displayed the memories he's captured for his birthday.

A video of the product reveal can be found in my portfolio: https://www.jeanpaultorre.com/

**Stack:** Python, Javascript, Node.js, Electron, sqlite3

## Goal:
* Create a module for Open Source Project MagicMirror that will display memories my friend has had on the current day
* Create a module for Open Source Project MagicMirror that will display memories his friends have captured
* Run this on a Raspberry pi 3

### Phase 1 Data Gathering:

* Problem: I need to get data (videos) for the module to be usedul
* Solution: My friend releases a "1 Second A Day" video every year that he uploads to youtube. I need to somehow extract each clip from the video.
* Solution: Ask his friends and family to submit videos

For this I created an algorithm in python that parses his youtube videos and extracts each individual clip. All it took was a little bit of math and some quick RGB comparisons to get this to work. I titled each clip the date in which it was taken.

### Phase 2 Data Storage:

* Problem: I needed a way to store these video clips somewhere for later access
* Solution: Find a lightweight Database Management System, Create database tables, Populate database tables

For this I created a python script that creates the database tables. I also wrote a script that creates a text file with all the data I needed. I then wrote a script that parses the text file and populates the corresponding databasetables. 

### Phase 3 Modules:

* Problem: I needed a way to display these memories I gathered and stored
* Solution: Create modules for Open Source Project MagicMirror and query the database whenever needed.

For this I created two modules. 

1. The first module I call **DayMemories**. It basically displays memories that occured on a given day. It queries the database I created in Phase 2 with the current data. It then displays the videos that were returned from the query on a loop for 24 hours. When its midnight a new set of memories are displayed. 

2. The second module I call **PersonalMemories**. It displays memories that my friend's friends and family submitted in carousel manner. These memories only display when the mirror is turned on. 


## Notes that I took throughout the project
The goal of this project is to make software that will go in a Raspberry Pi 3. Raspberry Pi will be used to make a smart mirror that will be given to my friend for his birthday. 

Specific to birthday present:
    My friend does a one second a day video recording. Then releases the edited footage a week after his birthday. Will write script that extracts each 1 second clip in the video and then use those clips to show him what he did one year ago in the mirror.

11/4 Notes:
    As in any project a lot of things change. I realized that there was already an open sourced smart mirror application. So as to not reinvent the wheel I will be writing modules for the Open Sourced Smart Mirror. It's github is right here: https://github.com/MichMich/MagicMirror.
    
-----------------------------
parse_video.py 

Functionality: Parse 1 second a day video and extracts every clip. 

Issue: Unfortunately each clip isn't 1 second. They vary between 0.6 to 1.2 seconds.
Solution: I used the moviepy library which gives me a lot of functionality with videos. The moviepy library allows me to get a frame from the video at a specific timestamp. So I get a frame every 0.1 seconds and compare it to the previous frame. I then aggregate the RGV value of every pixel in the frame and do a comparison to detect if they are in fact different clips.
-----------------------------
MemoryDatabase.py

Functionality: Creates database that will be used in Smart Memory Mirror. Parses a text document that I created for data.
-----------------------------

Personal Memories

Functionality: I asked my friend's family and friends to send me memories in video or image format to display in the mirror. This Module for the MagicMirror open sourced project displays images/videos in a rotating carousel format.

-----------------------------

Day Memories

Funcitonality: This is where the video clips parsed from parse_video.py and the database created in MemoryDatabase.py come together. Day Memories queries the database for memories(videos) that occured on this date and displays one after another. 
