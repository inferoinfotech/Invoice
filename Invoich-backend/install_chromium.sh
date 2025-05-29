#!/bin/bash
set -e

echo "Downloading Chromium binary..."
mkdir -p /opt/chromium
cd /opt/chromium

# Download a pre-built Chromium version
wget -q https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1204516/chrome-linux.zip

echo "Extracting Chromium..."
unzip -q chrome-linux.zip
rm chrome-linux.zip

echo "Setting executable permissions..."
chmod +x chrome-linux/chrome

echo "Chromium setup complete."
