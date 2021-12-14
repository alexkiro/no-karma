import secrets
from logging.config import dictConfig

from flask import Flask
from flask import jsonify
from flask import redirect
from flask import session
from flask import request
from flask_cors import CORS
from itsdangerous import BadSignature
from itsdangerous import SignatureExpired
from itsdangerous import URLSafeTimedSerializer

from api import settings
from api.conf import CONF
from api.views import oauth
from api.views import reddit

app = Flask(__name__)
app.config.from_mapping(CONF)

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s: %(message)s",
            }
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://flask.logging.wsgi_errors_stream",
                "formatter": "default",
            }
        },
        "root": {"level": "INFO", "handlers": ["wsgi"]},
    }
)

CORS(
    app,
    origins=[settings.VUE_APP_URL],
    expose_headers=["Content-Type", "Content-Disposition"],
    supports_credentials=True,
    max_age=3600,
    automatic_options=True,
)


csrf_serializer = URLSafeTimedSerializer(app.secret_key, salt="csrf-token")
csrf_methods = frozenset(["POST", "PUT", "PATCH", "DELETE"])


@app.after_request
def csrf_cookie(response):
    try:
        token = session["csrf-token"]
    except KeyError:
        token = secrets.token_urlsafe(64)
        session["csrf-token"] = token

    response.set_cookie(
        key="csrf-token",
        domain=settings.VUE_APP_HOST if not app.debug else None,
        value=csrf_serializer.dumps(token),
        secure=settings.HAS_HTTPS,
        httponly=False,
        samesite="Strict",
    )
    return response


@app.before_request
def verify_csrf():
    if request.method not in csrf_methods:
        return

    try:
        token = csrf_serializer.loads(request.headers["X-CSRF-Token"], max_age=1800)
    except KeyError:
        return jsonify({"status": "missing CSRF token"}), 400
    except SignatureExpired:
        return jsonify({"status": "CSRF token expired"}), 400
    except BadSignature:
        return jsonify({"status": "invalid CSRF token"}), 400

    if not secrets.compare_digest(token, session["csrf-token"]):
        return jsonify({"status": "CSRF token does not match"}), 400


@app.before_request
def make_session_permanent():
    if app.config["PERMANENT_SESSION_LIFETIME"] > 0:
        session.permanent = True


@app.route("/_ping")
def ping():
    """Pong"""
    return jsonify({"status": "pong"})


@app.route("/")
def home():
    """Convenience method for dev mostly."""
    return redirect(settings.VUE_APP_URL)


app.register_blueprint(oauth.urls)
# XXX this needs to be the last blueprint, as it's a catch-all
app.register_blueprint(reddit.urls)
