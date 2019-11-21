
# import dependencies
import tweepy
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import time
import argparse
import string
import json
import pymongo
from dateutil import parser as psr
from datetime import datetime
from pprint import pprint
from config import dbname, dbuser, psswd, host, parameters, consumer_key, consumer_secret, access_token, access_secret

connection_string ='mongodb+srv://' + dbuser + ':' + psswd + host + '/' + dbname + "?" + parameters
mongo_client = pymongo.MongoClient(connection_string)

def get_parser():
    """Get parser for command line arguments."""
    parser = argparse.ArgumentParser(description="Twitter Downloader")
    parser.add_argument("-q",
                        "--query",
                        dest="query",
                        help="Query/Filter",
                        default='-')
    parser.add_argument("-d",
                        "--data-dir",
                        dest="data_dir",
                        help="Output/Data Directory")
    parser.add_argument("-t",
                        "--tweets",
                        dest="tweets",
                        help="Output/Number of tweets (if not defined, process won't stop until you press CTRL+C)")
    return parser


class MyListener(StreamListener):
    """Custom StreamListener for streaming data."""

    def __init__(self, data_dir, query, tweets):
        # Subject/query filter for tweets
        self.query = query
        # Number of tweets that you want to get. Let 0 if you will stop the stream manually (CTRL+BREAK)  
        self.tweets = tweets
        # Number of the current tweet.
        self.currTweet = 0
        query_fname = format_filename(query)
        self.outfile = "%s/stream_%s.json" % (data_dir, query_fname)

    def on_data(self, data):
        try:
            with open(self.outfile, 'a') as f:
                f.write(data)
                self.currTweet += 1
                print("Subject: {} - Current Twitter {:09} - Total of Tweets to scrape {}".format(self.query, self.currTweet, self.tweets))
                db_data(data, self.query)
                # Check if the limit of tweets collected was achieved.
                if ((int(self.tweets) != 0) and (self.currTweet >= int(self.tweets))):
                    return False
                else:
                    return True

        except BaseException as e:
            print("Error on_data: %s" % str(e))
            time.sleep(5)
        return True

    def on_error(self, status):
        print(status)
        return True

def db_data(data, subject):
    try:        
        tweet = json.loads(data)
        user = {
                "id":           tweet["user"]["id"],
                "id_str":       tweet["user"]["id_str"], 
                "name":         tweet["user"]["name"],
                "screen_name":  tweet["user"]["screen_name"],
                "location":     tweet["user"]["location"],
                "description":  tweet["user"]["description"],
                "created_at":   psr.parse(tweet["user"]["created_at"])
                }

        # dt = psr.parse(tweet["created_at"])
        tweetObj = {
                    '#tag':subject,
                    'text': tweet["text"],
                    'module_sent_an': None,
                    'module_pollution': None,
                    'module_politics': None,
                    'module_environment': None,
                    'module_hate': None,
                    'twitter_created_at': psr.parse(tweet["created_at"]),
                    'dbai_created_at': datetime.now(),
                    'user': user,
                    'coordinates': tweet["coordinates"],
                    'place': tweet["place"]
                    }
        mongo_client.dbAI.twitter.insert_one(tweetObj)
        return True
    except BaseException as e:
        print("Error db_data: %s" % str(e))
    return True

def format_filename(fname):
    """Convert file name into a safe string.
    Arguments:
        fname -- the file name to convert
    Return:
        String -- converted file name
    """
    return ''.join(convert_valid(one_char) for one_char in fname)

def convert_valid(one_char):
    """Convert a character into '_' if invalid.
    Arguments:
        one_char -- the char to convert
    Return:
        Character -- converted char
    """
    valid_chars = "-_.%s%s" % (string.ascii_letters, string.digits)
    if one_char in valid_chars:
        return one_char
    else:
        return '_'

@classmethod
def parse(cls, api, raw):
    status = cls.first_parse(api, raw)
    setattr(status, 'json', json.dumps(raw))
    return status

if __name__ == '__main__':
    parser = get_parser()
    args = parser.parse_args()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_secret)
    api = tweepy.API(auth)

    twitter_stream = Stream(auth, MyListener(args.data_dir, args.query, args.tweets))
    twitter_stream.filter(track=[args.query],languages=["en"])
