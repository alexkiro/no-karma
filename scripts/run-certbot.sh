#!/usr/bin/env bash

set -evx

certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$VUE_APP_HOST"
certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$VUE_APP_API_HOST"
