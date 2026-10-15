$ErrorActionPreference = "Stop"

if (-not (Test-Path .env)) {
    Write-Host "Creating .env from .env.example..."
    Copy-Item .env.example .env
}

Write-Host "Verifying persistent host data directories..."
$dirs = @("data/storage/public", "data/storage/receipts", "data/storage/private", "data/redis")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host "Building and starting containers..."
docker compose build app
docker compose up -d db redis

Write-Host "Installing PHP dependencies..."
docker compose run --rm app composer install --no-scripts

Write-Host "Generating application key..."
docker compose run --rm app php artisan key:generate

Write-Host "Running migrations and seeders..."
docker compose run --rm app php artisan migrate --seed

Write-Host "Creating storage symlink..."
docker compose run --rm app php artisan storage:link --force

Write-Host "Creating test database if not exists..."
try {
    docker compose exec -T db createdb -U mc_ctrlr mc_ctrlr_test 2>$null
} catch {
    # Ignore if already exists
}

Write-Host "Generating routes..."
docker compose run --rm app php artisan wayfinder:generate --with-form

Write-Host "Installing frontend dependencies & building assets..."
docker compose run --rm node npm install
docker compose run --rm node npm run build

Write-Host "Starting application, redis and nginx..."
docker compose up -d app nginx redis

Write-Host ""
Write-Host "Ready: http://localhost:8000 (app) or http://localhost:8080 (nginx)"
