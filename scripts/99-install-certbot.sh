#!/usr/bin/env bash

set -evx

# Check if any certificates are already available and install them into the nginx conf
certbot install --nginx --cert-name "$VUE_APP_HOST" -n || echo ""
certbot install --nginx --cert-name "$VUE_APP_API_HOST" -n || echo ""
# If successful the previous commands would will start nginx prematurely, stop it here
nginx -s stop && sleep 1 || echo ""
# Enable http2, see https://github.com/certbot/certbot/issues/3646
sed -i "s/listen 443 ssl;/listen 443 ssl http2;/" /etc/nginx/conf.d/*.conf