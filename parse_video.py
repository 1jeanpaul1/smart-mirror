# Import everything needed to edit video clips
import imageio
imageio.plugins.ffmpeg.download()
from moviepy.editor import *
from sys import stdin

class ParseVideo:
    """
    Detects where there is a clip change in a video and extracts the clip.
    Personal Usage: Clips will be used to populate database that will be used in Smart Memory Mirror.
    """

    # The threshold for cumulative RGV value between clips. If the difference between a previous clip and the current
    # clip is greater than the MAX_DIFFERENCE then I can assume it's a different clip.
    MAX_DIFFERENCE = 10000000

    def __init__(self, video_file, video_title):
        self.video_file = video_file
        self.video_title = video_title

    def rgbCount(self, frame):
        """
        Accumulates the rgb value of every pixel on a given frame
        :param frame: A frame in a video
        :return: A list with the red, green, and blue accumulated values
        """
        red = 0
        green = 0
        blue = 0
        for x in frame:
            for y in x:
                red += y[0]
                green += y[1]
                blue += y[2]
        return [red, green, blue]

    # returns a boolean.
    def different_clip(self, difference):
        """

        :param difference: The difference in RGB value between frames
        :return: True if difference is greater than the MAX_DIFFERENCE, False otherwise
        """
        if (MAX_DIFFERENCE - difference) < 0:
            return True
        else:
            return False


    def parse_video(self):
        """
        Parses a video and creates a new video file for every clip in the video.
        Compares the cumulative RGB value of the current frame and previous frame every 0.1 seconds of the video.
        If there is a drastic change then that means that there is a new clip.
        :return: Does not return anything
        """
        clip = VideoFileClip(self.video_file)
        current_frame_second = 0.0
        next_frame_second = 0.1
        start_clip = 0.0
        end_clip = 0.0
        currentSecond = 1
        while True:
            try:
                current_frame = clip.get_frame(current_frame_second)
                next_frame = clip.get_frame(next_frame_second)
                current_rgb = rgbCount(current_frame)
                next_rgb = rgbCount(next_frame)
                red_difference = abs(current_rgb[0] - next_rgb[0])
                green_difference = abs(current_rgb[1] - next_rgb[1])
                blue_difference = abs(current_rgb[2] - next_rgb[2])
                total_difference = red_difference + green_difference + blue_difference
                print("going...")
                print(end_clip - start_clip)
                if different_clip(total_difference) and end_clip - start_clip >= 0.5:
                    print("***DIFFERENCE***")
                    print(total_difference)
                    print("New clip...")
                    print("start_clip: " + str(start_clip))
                    print("end_clip: " + str(end_clip))
                    new_clip = clip.subclip(start_clip, end_clip)
                    title = str(currentSecond) + self.video_title
                    new_clip.write_videofile(title)
                    start_clip = end_clip + 0.1
                    currentSecond += 1
                end_clip += 0.1
                current_frame_second += 0.1
                next_frame_second += 0.1
            except:
                print("\nFinished...")
                break

if __name__ == '__main__':
    print("Please input the full video file name you would like to parse: ")
    video_file = stdin.readline().split('\n')[0]
    print("Please input a general title for the videos. example: second_2015")
    video_title = stdin.readline().split('\n')[0]
    video_title = '_%s.mp4' % video_title
    parse_video = ParseVideo(video_file, video_title)
    print("Started...")
    parse_video.parse_video()

