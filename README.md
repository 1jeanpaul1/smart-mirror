# smart-mirror

WORK IN PROGRESS

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
