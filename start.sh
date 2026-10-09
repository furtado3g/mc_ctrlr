#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Building and starting containers..."
docker compose build app
docker compose up -d db

echo "Installing PHP dependencies..."
docker compose run --rm app composer install --no-scripts

echo "Generating application key..."
docker compose run --rm app php artisan key:generate

echo "Running migrations and seeders..."
docker compose run --rm app php artisan migrate --seed

echo "Creating test database if not exists..."
docker compose exec -T db createdb -U mc_ctrlr mc_ctrlr_test 2>/dev/null || true

echo "Generating routes..."
docker compose run --rm app php artisan wayfinder:generate --with-form

echo "Installing frontend dependencies & building assets..."
docker compose run --rm node npm install
docker compose run --rm node npm run build

echo "Starting application and nginx..."
docker compose up -d app nginx

echo "Ready: http://localhost:8000 (app) or http://localhost:8080 (nginx)"
