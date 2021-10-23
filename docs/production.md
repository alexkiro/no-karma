# Production
 
### Prerequisites

 - Have 4 hostnames available for:
   - frontend app host
   - api proxy host
   - video proxy host 
   - host for avatar service (https://github.com/dicebear/api) 
 - Docker and docker-compose installed

### Deploying with Docker

 - Clone repository
 - Create `.env.local` file, starting from example 
   ```
   cp .env.example .env.local
   ```
 - Edit and configure settings in the `.env.local` file
 - Build images 
   ```
   docker-compose build --pull
   ```
 - Start stack with docker-compose:
   ```
   docker-compose up -d
   ```
 - Enable HTTPS
   ```
   docker-compose exec frontend run-certbot.sh
   ```
   
### Updating 

 - Update local clone 
 - Re-build and restart stack 
   ```
   docker-compose build --pull
   docker-compose up -d
   ```