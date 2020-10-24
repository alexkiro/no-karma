"""Miscellaneous utilities"""
import urllib.parse
from flask import url_for


def str2bool(val, default_to_none=False):
    val = str(val).lower()
    if val in ("y", "yes", "t", "true", "on", "1"):
        return True
    elif val in ("n", "no", "f", "false", "off", "0"):
        return False
    elif val in ("null", "none"):
        return None
    elif not default_to_none:
        raise ValueError("invalid truth value %r" % (val,))
    else:
        return None
