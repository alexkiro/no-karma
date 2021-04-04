# Production
 
### Prerequisites

 - Have 3 hostnames available for:
   - frontend app host
   - api proxy host
   - video proxy host 
 - Docker and docker-compose installed

### Deploying with Docker

 - Clone repository
 - Create `.env.local` file, starting from example 
   ```
   cp .env.example .env.local
   ```
 - Edit and configure settings in the `.env.local` file
 - Start stack with docker-compose:
   ```
   docker-compose up -d --build
   ```
 - Enable HTTPS
   ```
   docker-compose exec frontend run-certbot.sh
   ```
   
### Updating 

 - Update local clone 
 - Re-build and restart stack 
   ```
   docker-compose up -d --build
   ```