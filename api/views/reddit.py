import urllib.parse

import requests
from flask import Blueprint
from flask import make_response
from flask import request
from flask import current_app as app

from api import settings
from api.token import get_token

urls = Blueprint("reddit", __name__)


@urls.route("/<path:path>", methods=settings.REDDIT_API_METHODS)
def reddit_api(path):
    """Proxy API request to Reddit"""
    # Prepare API call details
    app.logger.debug("/%s: preparing", path)
    url = urllib.parse.urljoin(settings.REDDIT_API_HOST, "/" + path)
    headers = filter_headers(request.headers)
    headers["User-Agent"] = settings.REDDIT_OAUTH_USER_AGENT

    token = get_token()
    headers["Authorization"] = f"{token['token_type']} {token['access_token']}"

    # Proxy API call to Reddit, make sure to handle gzipped types.
    # TODO: handle connection errors and so on
    proxy_req = requests.Request(
        method=request.method,
        url=url,
        params=request.args,
        data=request.get_data(),
        headers=headers,
    )
    app.logger.debug("/%s: sending", path)
    proxy_resp = requests.Session().send(
        proxy_req.prepare(),
        stream=True,
        timeout=(settings.REDDIT_CONNECT_TIMEOUT, settings.REDDIT_READ_TIMEOUT),
    )
    app.logger.debug("/%s: reading", path)
    content = proxy_resp.raw.read()
    app.logger.debug("/%s: making response", path)
    response = make_response(
        content,
        proxy_resp.status_code,
        filter_headers(proxy_resp.headers),
    )
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
