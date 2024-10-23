#!/usr/bin/env bash
# Use this script to start a docker container for a local development MySQL database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-mysql.sh`

# On Linux and macOS you can run this script directly - `./start-mysql.sh`

DB_CONTAINER_NAME="rapport"

if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install Docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "MySQL container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing MySQL container '$DB_CONTAINER_NAME' started"
  exit 0
fi

if [ ! -f .env ]; then
    touch .env
    echo "Created new .env file"

    echo 'DATABASE_URL="mysql://root:password@localhost:3306/'$DB_CONTAINER_NAME'"' >> .env
fi

# import env variables from .env
set -a
source .env

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set a password in the .env file and try again"
    exit 1
  fi
  # Generate a random URL-safe password
  DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
  sed -i -e "s#:password@#:$DB_PASSWORD@#" .env
fi

docker run -d \
  --name $DB_CONTAINER_NAME \
  -e MYSQL_ROOT_PASSWORD="$DB_PASSWORD" \
  -e MYSQL_DATABASE="$DB_CONTAINER_NAME" \
  -p 3306:3306 \
  docker.io/mysql:latest && echo "MySQL container '$DB_CONTAINER_NAME' was successfully created"

