#!/usr/bin/env bash

set -evx

grep -rh "server_name" /etc/nginx/conf.d/ | tr ';' ' ' | awk '{ print $2 }' | sort | uniq | while read line; do
  certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$line"
done

/usr/bin/enable-http2.sh
nginx -s reload
