#!/usr/bin/env python3

import requests

requests.get("http://localhost/_ping").raise_for_status()
