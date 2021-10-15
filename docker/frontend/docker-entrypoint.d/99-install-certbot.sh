#!/usr/bin/env bash

set -evx

grep -rh "server_name" /etc/nginx/conf.d/ | tr ';' ' ' | awk '{ print $2 }' | sort | uniq | while read line; do
  # Check if any certificates are already available and install them into the nginx conf
  certbot install --nginx --cert-name "$line" -n || echo ""
done

# If successful the previous commands would will start nginx prematurely, stop it here
nginx -s stop && sleep 1 || echo ""

/usr/bin/enable-http2.sh
