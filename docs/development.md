# Development

### Prerequisites 

Pre-requisites:

 - Node 16+ installed
 - Python3.8+ installed  

   
### Installation

Steps:  

 - Clone repo
 - Create and activate a python virtualenv 
 - Install backend dependencies
   ```
   pip install -c requirements/constraints.txt -r requirements/dev.txt
   ```
 - Install frontend dependencies
   ```
   npm install
   ```
 - Create `.env.local` file, starting from example 
   ```
   cp .env.dev.example .env.local
   ```
 - Edit and configure settings in the `.env.local` file (`REDDIT_OAUTH_*` and `SECRET_KEY` must be set)
 - Run backend with hot-reload
   ```
   python -m api
   ```
 - Run frontend with hot-reload
   ```
   npm run serve
   ```

### IMPORTANT

 - Any change made to the `.env.local` file requires a restart of the hot-reload servers.


### Video proxy server

Videos hosted by reddit will not work locally unless a proxy server is used that can set the CORS
headers. Example on how to install one locally:

 - Install nginx 
 - Edit `/etc/nginx/conf.d/default.conf` with:
   ```
   server {
      listen 8888;
      server_name localhost;
    
      location / {
        proxy_pass https://v.redd.it/;
        proxy_hide_header 'Access-Control-Allow-Origin';
        add_header 'Access-Control-Allow-Origin' 'http://localhost:8080' always;
      }
   }
   ```
 - Restart nginx, e.g:
   ```
   sudo systemctl restart nginx
   ```


### Coding Style

#### Backend

The backend code uses the [black style guide](https://black.readthedocs.io/en/stable/).

#### Frontend

The code uses the [vue recommended](https://vuejs.org/v2/style-guide/#Priority-C-Recommended) style via 
ESLint plugins. Please ensure that you have an ESLint plugin installed. Or ensure to lint and auto-fix 
your code before pushing with: 

```
npm run lint
```