# MachineLearning-SentimentAnalysis

# Prerequisites
Python, Pandas, MongoDB, Pymongo, Numpy, TextBlob, Tweepy, NLTK Sklearn, Tf- Idf, Bag of words, Argparse, Sklearn, NGrams.

# Coding style tests
# BAG OF WORDS - Should be created every time we introduce new data o our pipeline.
from sklearn.feature_extraction.text import CountVectorizer
vectorize = CountVectorizer(lowercase = False, max_features = 50)
bag_of_words = vectorize.fit_transform(df_tweets["tweet"])
print(bag_of_words.shape)
(1057, 50)

# Create a Logistic Regression Model
from sklearn.model_selection import train_test_split

train, test, class_train, class_test = train_test_split(bag_of_words,
                                                              df_tweets["label"],
                                                              random_state = 42)
