#!/usr/bin/env bash

set -evx

# Convert any env variable that should be used in the frontend into a JSON file that can be loaded async
# Removes the need to hardcode builds for specific envs.
jq -n env | jq -c 'to_entries|map(select(.key|startswith("VUE_APP")))' > /usr/share/nginx/html/env.json