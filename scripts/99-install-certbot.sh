#!/usr/bin/env bash

set -v

# Check if any certificates are already available and install them into the nginx conf
certbot install --nginx --cert-name "$VUE_APP_HOST" -n || echo ""
certbot install --nginx --cert-name "$VUE_APP_API_HOST" -n || echo ""