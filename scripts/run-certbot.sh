#!/usr/bin/env bash

set -evx

certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$VUE_APP_HOST"
certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$VUE_APP_API_HOST"
# Enable http2, see https://github.com/certbot/certbot/issues/3646
sed -i "s/listen 443 ssl;/listen 443 ssl http2;/" /etc/nginx/conf.d/*.conf
