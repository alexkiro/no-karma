"""Flask configuration

https://flask.palletsprojects.com/en/1.1.x/config/
"""

import os

from api.settings import HAS_HTTPS
from api.settings import VUE_APP_API_HOST

CONF = {
    # https://flask.palletsprojects.com/en/1.1.x/config/#SECRET_KEY
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    # https://flask.palletsprojects.com/en/1.1.x/config/#SESSION_COOKIE_NAME
    "SESSION_COOKIE_NAME": "__Host-session" if HAS_HTTPS else "session",
    # https://flask.palletsprojects.com/en/1.1.x/config/#SESSION_COOKIE_DOMAIN
    "SESSION_COOKIE_DOMAIN": False,
    # https://flask.palletsprojects.com/en/1.1.x/config/#SESSION_COOKIE_SAMESITE
    "SESSION_COOKIE_SAMESITE": "Strict",
    # https://flask.palletsprojects.com/en/1.1.x/config/#SESSION_COOKIE_HTTPONLY
    "SESSION_COOKIE_HTTPONLY": True,
    # https://flask.palletsprojects.com/en/1.1.x/config/#SESSION_COOKIE_SECURE
    "SESSION_COOKIE_SECURE": HAS_HTTPS,
    # https://flask.palletsprojects.com/en/1.1.x/config/#PERMANENT_SESSION_LIFETIME
    "PERMANENT_SESSION_LIFETIME": int(os.getenv("PERMANENT_SESSION_LIFETIME", "0")),
    # https://flask.palletsprojects.com/en/1.1.x/config/#SERVER_NAME
    "SERVER_NAME": VUE_APP_API_HOST,
}
