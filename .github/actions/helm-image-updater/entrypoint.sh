#!/bin/bash

set -e

# Run the helm-image-updater CLI with all provided arguments
exec node /app/dist/index.js "$@"