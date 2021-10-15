#!/usr/bin/env bash

set -ev

# Enable http2, see https://github.com/certbot/certbot/issues/3646
grep -L "http2" /etc/nginx/conf.d/*.conf | xargs sed -i "s/443 ssl/443 ssl http2/"
