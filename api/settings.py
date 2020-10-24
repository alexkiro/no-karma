import os

from dotenv import load_dotenv

from . import __version__
from .utils import str2bool

# Use for reddit API calls
USER_AGENT = f"web:no-karma:{__version__} (by /u/alexkiro)"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env.local"))

REDDIT_OAUTH_CLIENT_ID = os.getenv("REDDIT_OAUTH_CLIENT_ID")
REDDIT_OAUTH_CLIENT_SECRET = os.getenv("REDDIT_OAUTH_CLIENT_SECRET")
REDDIT_SCOPES = " ".join(
    [
        "identity",
        # "edit",
        # "flair",
        # "history",
        # "modconfig",
        # "modflair",
        # "modlog",
        # "modposts",
        # "modwiki",
        "mysubreddits",
        # "privatemessages",
        "read",
        # "report",
        # "save",
        # "submit",
        "subscribe",
        "vote",
        # "wikiedit",
        "wikiread",
    ]
)
HAS_HTTPS = str2bool(os.getenv("HAS_HTTPS", "true"))
VUE_APP_HOST = os.getenv("VUE_APP_HOST", "localhost:8080")

_protocol = "https" if HAS_HTTPS else "http"
VUE_APP_URL = f"{_protocol}://{VUE_APP_HOST}"
REDIRECT_URI = f"{VUE_APP_URL}/_oauth/redirect"
