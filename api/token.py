"""Handle OAuth access token."""

import base64
import json
import time

import requests
from flask import abort
from flask import current_app as app
from flask import request

from api import settings


def reddit_access_token(data):
    """Get a new access token from reddit

    :param data: POST data to send in the access token request
    :return: access token data from reddit OAuth
    """
    stamp = int(time.time())
    app.logger.debug("Requesting new token: %(grant_type)s", data)
    reddit_response = requests.post(
        settings.REDDIT_OAUTH_ACCESS_TOKEN_URL,
        data=data,
        headers={
            "User-Agent": settings.REDDIT_OAUTH_USER_AGENT,
        },
        auth=(settings.REDDIT_OAUTH_CLIENT_ID, settings.REDDIT_OAUTH_CLIENT_SECRET),
        timeout=(settings.REDDIT_CONNECT_TIMEOUT, settings.REDDIT_READ_TIMEOUT),
    )
    reddit_response.raise_for_status()
    app.logger.debug("New token request response: %s", reddit_response)
    token = reddit_response.json()
    if "error" in reddit_response:
        app.logger.debug("Unable to the complete OAuth: %s", token["error"])
        return abort(403)

    token["timestamp"] = stamp
    return token


def set_token(response, token):
    """Set cookie with the new access token details."""
    response.set_cookie(
        "oauth",
        base64.b64encode(json.dumps(token).encode()),
        secure=settings.HAS_HTTPS,
        httponly=True,
        samesite="strict",
    )


def get_token():
    """Get access token details from cookies."""
    # TODO: check if the required scopes have changed, and force re-authorization
    try:
        token = json.loads(base64.b64decode(request.cookies["oauth"]))
    except (KeyError, AttributeError, ValueError):
        # No token available, request an anonymous one.
        token = reddit_access_token({"grant_type": "client_credentials"})
    else:
        # Token available check if it's expired, and refresh it if needed.
        # Refresh token 5 minutes before it expires, to prevent weirdness.
        if (int(time.time()) - token["timestamp"]) > (token["expires_in"] - (60 * 5)):
            if "refresh_token" in token:
                token = reddit_access_token(
                    {
                        "grant_type": "refresh_token",
                        "refresh_token": token["refresh_token"],
                    }
                )
            else:
                # Anonymous tokens cannot be refreshed.
                token = reddit_access_token({"grant_type": "client_credentials"})
    return token
