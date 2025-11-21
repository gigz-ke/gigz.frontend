#!/bin/sh

# Replace placeholders in env.js with actual environment variables
envsubst '${API_BASE_URL}' < /usr/share/nginx/html/env.js > /usr/share/nginx/html/env.js.tmp
mv /usr/share/nginx/html/env.js.tmp /usr/share/nginx/html/env.js

# Start nginx
nginx -g 'daemon off;'