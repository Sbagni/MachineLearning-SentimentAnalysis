import tweepy
import numpy as np
import config as cfg

class StreamListener(tweepy.StreamListener):
    def __init__(self, api):
        self.api = api
        self.me = api.me()
        self.text = ""

    def on_status(self, tweet):
        self.text = tweet.text
        return False

    def on_error(self, status):
        print("Error detected")

# Twitter Authentication
auth = tweepy.OAuthHandler(cfg.consumer_key, cfg.consumer_secret)
auth.set_access_token(cfg.access_token, cfg.access_secret)

# Create API object
api = tweepy.API(auth, wait_on_rate_limit=True,
    wait_on_rate_limit_notify=True)

# Function to execute the stream and return the tweet
def run_api(filter):
    tweets_listener = StreamListener(api)
    stream = tweepy.Stream(api.auth, tweets_listener)
    stream.filter(track=[filter], languages=["en"])
    return tweets_listener.text

