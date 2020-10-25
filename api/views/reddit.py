import urllib.parse

import requests
from flask import Blueprint
from flask import make_response
from flask import request

from api import settings
from api.token import get_token
from api.token import set_token

urls = Blueprint("reddit", __name__)


@urls.route("/<path:path>", methods=settings.REDDIT_API_METHODS)
def reddit_api(path):
    """Proxy API request to Reddit"""
    # Prepare API call details
    url = urllib.parse.urljoin(settings.REDDIT_API_HOST, "/" + path)
    headers = filter_headers(request.headers)
    headers["User-Agent"] = settings.REDDIT_OAUTH_USER_AGENT

    oauth = get_token()
    headers["Authorization"] = f"{oauth['token_type']} {oauth['access_token']}"

    # Proxy API call to Reddit, make sure to handle gzipped types.
    # TODO: handle connection errors and so on
    proxy_req = requests.Request(
        method=request.method,
        url=url,
        params=request.args,
        data=request.data,
        headers=headers,
    )
    proxy_resp = requests.Session().send(
        proxy_req.prepare(),
        stream=True,
        timeout=(settings.REDDIT_CONNECT_TIMEOUT, settings.REDDIT_READ_TIMEOUT),
    )
    response = make_response(
        proxy_resp.raw.read(),
        proxy_resp.status_code,
        filter_headers(proxy_resp.headers),
    )
    # Update cookie with new token
    set_token(response, oauth)
    return response


def filter_headers(headers):
    """Filter request or response headers and only include safe ones."""
    new_headers = {}
    for name, value in headers.items():
        lname = name.lower()
        if lname not in settings.REDDIT_API_PASS_HEADERS:
            continue
        if lname == "location":
            split = urllib.parse.urlsplit(value)
            value = urllib.parse.urlunsplit(
                (
                    request.scheme,
                    request.host,
                    split.path,
                    split.query,
                    split.fragment,
                )
            )

        new_headers[name] = value
    return new_headers
