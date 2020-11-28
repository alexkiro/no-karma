#!/usr/bin/env bash

set -evx

grep -rh "server_name" /etc/nginx/conf.d/ | tr ';' ' ' | awk '{ print $2 }' | sort | uniq | while read line; do
  certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$line"
done
# Enable http2, see https://github.com/certbot/certbot/issues/3646
sed -i "s/listen 443 ssl;/listen 443 ssl http2;/" /etc/nginx/conf.d/*.conf
nginx -s reload
