from flask import Flask
from flask import redirect
from flask import session
from flask_cors import CORS

from api import settings
from api.conf import CONF
from api.views import oauth
from api.views import reddit

app = Flask(__name__)
app.config.from_mapping(CONF)

CORS(
    app,
    origins=[settings.VUE_APP_URL],
    expose_headers=["Content-Type", "Content-Disposition"],
    supports_credentials=True,
    max_age=3600,
    automatic_options=True,
)


@app.before_request
def make_session_permanent():
    if app.config["PERMANENT_SESSION_LIFETIME"] > 0:
        session.permanent = True


@app.route("/")
def home():
    """Convenience method for dev mostly."""
    return redirect(settings.VUE_APP_URL)


app.register_blueprint(oauth.urls)
# XXX this needs to be the last blueprint, as it's a catch-all
app.register_blueprint(reddit.urls)
