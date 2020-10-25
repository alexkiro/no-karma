FROM node:14 as builder

# Install packages
COPY vue.config.js .
COPY babel.config.js .
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy app
COPY public public/
COPY src src/

# Build app
RUN npm run build

FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf

RUN apt update && \
    apt install -y python3 python3-dev libffi6 libffi-dev libssl-dev curl build-essential procps && \
    curl -L 'https://bootstrap.pypa.io/get-pip.py' | python3 && \
    pip install -U cffi certbot certbot-nginx && \
    apt remove --purge -y python3-dev build-essential libffi-dev libssl-dev curl && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/templates
COPY docker/frontend/ /etc/nginx/templates/

COPY --from=builder /dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
STOPSIGNAL SIGTERM

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

