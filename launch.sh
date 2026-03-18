#!/bin/bash

set -e

echo "========================================"
echo "🕹️  Red Tetris Auto-Launcher"
echo "========================================"
echo ""

# 1. Check & Install Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker is not installed. Installing Docker now..."
    echo "Prompting for sudo password to run the official Docker installer:"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    echo "✓ Docker installed successfully."
else
    echo "✓ Docker is already installed."
fi

# 2. Check & Install Docker Compose
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    echo "✓ Docker Compose plugin found."
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo "✓ Docker Compose standalone found."
else
    echo "⚠️ Docker Compose not found. Installing the plugin..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    COMPOSE_CMD="docker compose"
    echo "✓ Docker Compose installed."
fi

# 3. Check Daemon & Handle Permissions
SUDO_PREFIX=""
if ! docker info &> /dev/null; then
    echo "⚠️ Docker daemon is not responding. Attempting to start the service..."
    sudo systemctl start docker || true
    sudo systemctl enable docker || true
    
    # Give it a second to wake up
    sleep 2
    
    # Check again. If it still fails, it's a permissions issue.
    if ! docker info &> /dev/null; then
        if sudo docker info &> /dev/null; then
            echo "⚠️ Your user is not in the 'docker' group. Falling back to using 'sudo'..."
            SUDO_PREFIX="sudo "
        else
            echo "❌ Fatal Error: Docker daemon will not start. Please reboot or check your system."
            exit 1
        fi
    else
         echo "✓ Docker daemon is now running."
    fi
else
    echo "✓ Docker daemon is awake and accessible."
fi

echo ""
echo "🚀 Building and starting Red Tetris..."
echo ""

# 4. Launch the application!
# Using the SUDO_PREFIX dynamically if they don't have user permissions
$SUDO_PREFIX $COMPOSE_CMD up -d --build

echo ""
echo "========================================"
echo "🎉 All services started successfully!"
echo "========================================"
echo ""
echo "Services running:"
echo "  • Frontend Webapp: http://localhost"
echo "  • Backend Server:  http://localhost/api"
echo "  • Traefik:         http://localhost:8080"
echo ""
echo "To view logs:"
echo "  $SUDO_PREFIX $COMPOSE_CMD logs -f"
echo ""
echo "To stop services:"
echo "  $SUDO_PREFIX $COMPOSE_CMD down"
echo ""