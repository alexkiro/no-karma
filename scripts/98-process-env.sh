#!/usr/bin/env bash

set -evx

jq -n env | jq -c 'to_entries|map(select(.key|startswith("VUE_APP")))' > /usr/share/nginx/html/env.json