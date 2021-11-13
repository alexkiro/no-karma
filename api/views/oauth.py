import time
import urllib.parse
import uuid

import requests
from flask import abort
from flask import Blueprint
from flask import current_app as app
from flask import jsonify
from flask import redirect
from flask import request
from flask import session

from api import settings
from api.token import get_token
from api.token import reddit_access_token

urls = Blueprint("oauth", __name__)


@urls.route("/_oauth/authorize")
def oauth_authorize():
    """Initiate the OAuth authorization workflow for the user:

    - save a unique state for this authorization process
    - redirect the user the reddit authorization page
    """
    state = str(uuid.uuid4())
    query = urllib.parse.urlencode(
        {
            "client_id": settings.REDDIT_OAUTH_CLIENT_ID,
            "response_type": "code",
            "state": state,
            "redirect_uri": settings.REDDIT_OAUTH_REDIRECT_URI,
            "duration": "permanent",
            "scope": settings.REDDIT_OAUTH_SCOPES,
        }
    )
    session[settings.REDDIT_OAUTH_NONCE_KEY] = {
        "state": state,
        "timestamp": int(time.time()),
    }

    return redirect(f"{settings.REDDIT_OAUTH_AUTHORIZE_URL}?{query}")


@urls.route("/_oauth/complete")
def oauth_complete():
    """Must be called to finish the OAuth authorization workflow:

    - checks if the state param matches the one in the cookie
    - requests an access token
    - stores the access token in the cookies
    """
    if request.args.get("error"):
        app.logger.debug("Unable to the complete OAuth: %s", request.args.get("error"))
        return abort(403)

    state = request.args["state"]
    try:
        nonce = session[settings.REDDIT_OAUTH_NONCE_KEY]
    except KeyError:
        return abort(403)

    if nonce["state"] != state or time.time() - nonce["timestamp"] > 300:
        app.logger.debug("Invalid state code")
        return abort(403)

    token = reddit_access_token(
        {
            "grant_type": "authorization_code",
            "code": request.args["code"],
            "redirect_uri": settings.REDDIT_OAUTH_REDIRECT_URI,
        }
    )

    del session[settings.REDDIT_OAUTH_NONCE_KEY]
    session[settings.REDDIT_OAUTH_SESSION_KEY] = token
    return jsonify({"status": "ok"})


@urls.route("/_oauth/revoke", methods=["POST"])
def oauth_revoke():
    """Logout of the application"""
    try:
        # Optionally try to revoke the token.
        app.logger.debug("Attempting to revoke token")
        token = get_token()
        try:
            data = {
                "token": token["refresh_token"],
                "token_type_hint": "refresh_token",
            }
        except KeyError:
            data = {
                "token": token["access_token"],
                "token_type_hint": "access_token",
            }
        reddit_response = requests.post(
            settings.REDDIT_OAUTH_REVOKE_TOKEN_URL,
            data,
            headers={
                "User-Agent": settings.REDDIT_OAUTH_USER_AGENT,
            },
            auth=(settings.REDDIT_OAUTH_CLIENT_ID, settings.REDDIT_OAUTH_CLIENT_SECRET),
            timeout=(settings.REDDIT_CONNECT_TIMEOUT, settings.REDDIT_READ_TIMEOUT),
        )
        app.logger.debug("Token revoke response: %s", reddit_response)
        reddit_response.raise_for_status()
    except requests.RequestException as e:
        app.logger.warning("Unable to revoke token: %s", e, exc_info=True)

    session.clear()
    return jsonify({"status": "ok"})
