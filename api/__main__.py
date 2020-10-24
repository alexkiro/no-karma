"""Run in development mode.

!!!DO NOT USE FOR PRODUCTION!!!
"""
import argparse

parser = argparse.ArgumentParser(
    prog="python -m api",
    description=__doc__,
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
)
parser.add_argument("--port", default=8000)
parser.add_argument("--host", default="127.0.0.1")
args = parser.parse_args()

from .views import app

app.run(args.host, port=args.port, debug=True)
