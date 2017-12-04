# smart-mirror

The goal of this project is to make software that will go in a Raspberry Pi 3. Raspberry Pi will be used to make a smart mirror that will be given to my friend for his birthday. Will make the mirror abstract enough that anyone can populate the data with information about his/her friends/family.

Functionaility:

1. Show weather and time
2. Show important news that occured recently
3. Will tell user how he/she looks when walking infront of the mirror
4. Will install an audio card and microphone to raspberry pi for voice commands
    - reminders
    - alarms
    - weather information
    - text messaging (to predetermined number)

Specific to birthday present (optional):
    My friend does a one second a day video recording. Then releases the edited footage a week after his birthday. Will write software that takes a sreenshot of every second in the video and then use those images to show him what he did one year ago in the mirror.

5. Will have a button that sends input to the raspbery pi. Once pressed it will display several of the images from his one second a day video floating across the mirror.

    Pipeline:
        - Design and create database: 10/1 ✓ (completed on time)
        - Write Model for data: 10/12
        - Create GUI to display data: 10/15
        - Create Controller for Model and View: 10/22
        - Install software into Raspberry Pi: 10/29
        - Get and put together all hardware components(monitor, frame, mirror): 11/5
        - Finish Testing: 11/12
        - Give Present: 11/22

10/1 Notes:
There are currently Three tables:
    1. user(id(pk), first_name(varchar), last_name(varchar), birthday(date))
    2. reminder(id(pk), reminder_dateime(datetime), reminder(varchar))
    3. smart_album(id(pk), date_taken (date), year_taken(year), file_path(varchar))
Completed basic tables needed.
Things that I could add later: If I want the ability to have multiple users in the mirror I could add a foreign key in the reminder and smart_album tables to the user table.

11/4 Notes:
    As in any project a lot of things change. I realized that there was already an open sourced smart mirror application. So as to not reinvent the wheel I will be writing modules for the Open Sourced Smart Mirror. It's github is right here: https://github.com/MichMich/MagicMirror.
