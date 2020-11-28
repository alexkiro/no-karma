"""Handle OAuth access token."""

import time

import requests
from flask import abort
from flask import current_app as app
from flask import session

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


def is_token_expired(token):
    """Test if token is expired, to refresh it if needed. Adds a grace period of 5
    minutes to prevent weirdness.
    """
    try:
        return (time.time() - token["timestamp"]) > (token["expires_in"] - (60 * 5))
    except KeyError:
        return True


def get_anon_token():
    """Get an anonymous token and store it in the session"""
    token = reddit_access_token({"grant_type": "client_credentials"})
    session[settings.REDDIT_OAUTH_SESSION_KEY] = token
    return token


def maybe_refresh_token(token):
    """Check if token needs to be refreshed and return the new token.
    If there is no need to refresh the token, simply NOOP and return
    the current token.
    """
    if not is_token_expired(token):
        return token

    if "refresh_token" not in token:
        # Anonymous tokens cannot be refreshed, just get a new one.
        return get_anon_token()

    try:
        new_token = reddit_access_token(
            {
                "grant_type": "refresh_token",
                "refresh_token": token["refresh_token"],
            }
        )
    except requests.exceptions.RequestException as e:
        app.logger.debug("Unable to refresh token: %s", e)
        return get_anon_token()

    token.update(new_token)
    session.modified = True
    return token


def get_token():
    """Get access token details from cookies."""
    # TODO: check if the required scopes have changed, and force re-authorization
    try:
        token = session[settings.REDDIT_OAUTH_SESSION_KEY]
    except (KeyError, AttributeError, ValueError):
        # No token available, request an anonymous one.
        return get_anon_token()
    else:
        return maybe_refresh_token(token)
