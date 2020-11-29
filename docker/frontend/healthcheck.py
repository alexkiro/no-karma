#!/usr/bin/env python3

import os
import requests

responses = [
    requests.get("http://localhost/", headers={"Host": os.environ["VUE_APP_HOST"]}),
    requests.get(
        "http://localhost/_ping", headers={"Host": os.environ["VUE_APP_API_HOST"]}
    ),
    requests.get(
        "http://localhost/robots.txt",
        headers={"Host": os.environ["VUE_APP_VIDEO_HOST"]},
    ),
]

for response in responses:
    response.raise_for_status()
