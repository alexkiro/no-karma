import os

from dotenv import load_dotenv

from . import __version__
from .utils import str2bool

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env.local"))

# ====================================================================
# === App details
HAS_HTTPS = str2bool(os.getenv("HAS_HTTPS", "true"))
PROTOCOL = "https" if HAS_HTTPS else "http"

# Host of the frontend application
VUE_APP_HOST = os.getenv("VUE_APP_HOST")

# URL to the frontend application
VUE_APP_URL = f"{PROTOCOL}://{VUE_APP_HOST}"

# URL of the backend application
VUE_APP_API_HOST = os.getenv("VUE_APP_API_HOST")

# ====================================================================
# === Reddit OAuth details.
REDDIT_OAUTH_NONCE_KEY = "_nonce"
REDDIT_OAUTH_SESSION_KEY = "_oauth"
REDDIT_OAUTH_APP_NAME = os.getenv("REDDIT_OAUTH_APP_NAME")
REDDIT_OAUTH_CLIENT_ID = os.getenv("REDDIT_OAUTH_CLIENT_ID")
REDDIT_OAUTH_CLIENT_SECRET = os.getenv("REDDIT_OAUTH_CLIENT_SECRET")
REDDIT_OAUTH_AUTHORIZE_URL = "https://www.reddit.com/api/v1/authorize"
REDDIT_OAUTH_ACCESS_TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
REDDIT_OAUTH_REVOKE_TOKEN_URL = "https://www.reddit.com/api/v1/revoke_token"
# XXX Redirect URI, must be a page to the frontend APP, as the
#  state is stored in a Strict cookie, and will not be available
#  if a third-party (in this case Reddit) redirects  to the backend
#  endpoint directly.
REDDIT_OAUTH_REDIRECT_URI = f"{VUE_APP_URL}/_oauth/redirect"
# Use for requests to Reddit
REDDIT_OAUTH_USER_AGENT = f"web:{REDDIT_OAUTH_APP_NAME}:{__version__} (by /u/alexkiro)"
REDDIT_OAUTH_SCOPES = " ".join(
    [
        "identity",  # Required to get user details
        # "edit",
        # "flair",
        # "history",
        # "modconfig",
        # "modflair",
        # "modlog",
        # "modposts",
        # "modwiki",
        "mysubreddits",  # Required to get the list of subreddits
        # "privatemessages",
        "read",  # Required to get posts
        # "report",
        # "save",
        # "submit",
        "subscribe",
        # "vote",
        # "wikiedit",
        # "wikiread",
    ]
)

# ====================================================================
# === Reddit API
REDDIT_API_HOST = "https://oauth.reddit.com"
REDDIT_API_METHODS = [
    "GET",
    "HEAD",
    "OPTIONS",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
]
# Timeouts
REDDIT_CONNECT_TIMEOUT = 10
REDDIT_READ_TIMEOUT = 60
# Limit the headers sent to and from the reddit via the proxy.
REDDIT_API_PASS_HEADERS = {
    header.lower()
    for header in [
        "Accept",
        "Accept-CH",
        "Accept-CH-Lifetime",
        "Accept-Charset",
        "Accept-Encoding",
        "Accept-Language",
        "Accept-Patch",
        "Accept-Ranges",
        # "Access-Control-Allow-Credentials",
        # "Access-Control-Allow-Headers",
        # "Access-Control-Allow-Methods",
        # "Access-Control-Allow-Origin",
        # "Access-Control-Expose-Headers",
        # "Access-Control-Max-Age",
        # "Access-Control-Request-Headers",
        # "Access-Control-Request-Method",
        "Age",
        "Allow",
        "Alt-Svc",
        # "Authorization",
        "Cache-Control",
        "Clear-Site-Data",
        "Connection",
        "Content-Disposition",
        "Content-Encoding",
        "Content-Language",
        "Content-Length",
        "Content-Location",
        "Content-Range",
        # "Content-Security-Policy",
        # "Content-Security-Policy-Report-Only",
        "Content-Type",
        # "Cookie",
        # "Cookie2",
        # "Cross-Origin-Embedder-Policy",
        # "Cross-Origin-Opener-Policy",
        # "Cross-Origin-Resource-Policy",
        "DNT",
        # "DPR",
        "Date",
        # "Device-Memory",
        # "Digest",
        "ETag",
        # "Early-Data",
        "Expect",
        "Expect-CT",
        "Expires",
        # "Feature-Policy",
        # "Forwarded",
        # "From",
        # "Host",
        "If-Match",
        "If-Modified-Since",
        "If-None-Match",
        "If-Range",
        "If-Unmodified-Since",
        # "Index",
        "Keep-Alive",
        # "Large-Allocation",
        "Last-Modified",
        "Link",
        "Location",  # XXX Location is special, as it needs to be rewritten.
        # "NEL",
        # "Origin",
        # "Pragma",
        # "Proxy-Authenticate",
        # "Proxy-Authorization",
        # "Public-Key-Pins",
        # "Public-Key-Pins-Report-Only",
        # "Range",
        # "Referer",
        # "Referrer-Policy",
        # "Retry-After",
        # "Save-Data",
        # "Sec-Fetch-Dest",
        # "Sec-Fetch-Mode",
        # "Sec-Fetch-Site",
        # "Sec-Fetch-User",
        # "Sec-WebSocket-Accept",
        # "Server",
        # "Server-Timing",
        # "Set-Cookie",
        # "Set-Cookie2",
        # "SourceMap",
        # "Strict-Transport-Security",
        # "TE",
        # "Timing-Allow-Origin",
        # "Tk",
        # "Trailer",
        # "Transfer-Encoding",
        # "Upgrade-Insecure-Requests",
        # "User-Agent",
        "Vary",
        # "Via",
        # "WWW-Authenticate",
        # "Want-Digest",
        # "Warning",
        # "X-Content-Type-Options",
        # "X-DNS-Prefetch-Control",
        # "X-Forwarded-For",
        # "X-Forwarded-Host",
        # "X-Forwarded-Proto",
        # "X-Frame-Options",
        # "X-XSS-Protection",
    ]
}
