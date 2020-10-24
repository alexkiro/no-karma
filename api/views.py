import base64
import json
import time
import uuid
import urllib.parse

import requests
from flask import Flask, redirect, request, abort, Response, jsonify
from flask_cors import CORS

from api import settings

app = Flask(__name__)
CORS(
    app,
    origins=[settings.VUE_APP_URL],
    expose_headers=["Content-Type", "Content-Disposition"],
    supports_credentials=True,
    max_age=3600,
)


@app.route("/_oauth/authorize")
def oauth_authorize():
    state = str(uuid.uuid4())
    query = urllib.parse.urlencode(
        {
            "client_id": settings.REDDIT_OAUTH_CLIENT_ID,
            "response_type": "code",
            "state": state,
            "redirect_uri": settings.REDIRECT_URI,
            "duration": "permanent",
            "scope": settings.REDDIT_SCOPES,
        }
    )
    response = redirect("https://www.reddit.com/api/v1/authorize?" + query)
    response.set_cookie(
        "state",
        state,
        secure=settings.HAS_HTTPS,
        httponly=True,
        samesite="lax",
        max_age=300,
    )
    return response


@app.route("/_oauth/complete")
def oauth_complete():
    if request.args.get("error"):
        app.logger.debug("Unable to the complete OAuth: %s", request.args.get("error"))
        return abort(403)

    new_state = request.cookies["state"]
    state = request.args["state"]
    assert new_state == state
    code = request.args["code"]

    reddit_response = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.REDIRECT_URI,
        },
        headers={
            "User-Agent": settings.USER_AGENT,
        },
        auth=(settings.REDDIT_OAUTH_CLIENT_ID, settings.REDDIT_OAUTH_CLIENT_SECRET),
    )
    reddit_response.raise_for_status()
    auth_code = reddit_response.json()
    if "error" in reddit_response:
        app.logger.debug("Unable to the complete OAuth: %s", auth_code["error"])
        return abort(403)

    auth_code["timestamp"] = int(time.time())
    response = jsonify({"status": "ok"})
    response.set_cookie("oauth", base64.b64encode(json.dumps(auth_code).encode()))
    return response
