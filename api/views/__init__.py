from flask import Flask
from flask import redirect
from flask_cors import CORS

from api import settings
from api.views import oauth
from api.views import reddit

app = Flask(__name__)
CORS(
    app,
    origins=[settings.VUE_APP_URL],
    expose_headers=["Content-Type", "Content-Disposition"],
    supports_credentials=True,
    max_age=3600,
    automatic_options=True,
)


@app.route("/")
def home():
    """Convenience method for dev mostly."""
    return redirect(settings.VUE_APP_URL)


app.register_blueprint(oauth.urls)
# XXX this needs to be the last blueprint, as it's a catch-all
app.register_blueprint(reddit.urls)
