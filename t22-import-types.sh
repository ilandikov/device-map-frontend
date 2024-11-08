#!/bin/bash

# Usage: ./t22-import-types.sh <version>
# Example: ./t22-import-types.sh 1.2.3

# Define the paths to the repositories
EXPORTER_DIR="./../mancho-school-infrastructure"
IMPORTER_DIR="."

# Check if a version argument is provided
if [ -z "$1" ]; then
  echo "Error: Version not specified."
  echo "Usage: ./import-package.sh <version>"
  exit 1
fi

# Set the package name with the provided version
PACKAGE_NAME="mancho-school-t22-graphql-types"
PACKAGE_VERSION="$1"
PACKAGE_FILE="$PACKAGE_NAME-$PACKAGE_VERSION.tgz"  # Adjust to your actual package format

# Check if the exporter directory exists
if [ ! -d "$EXPORTER_DIR" ]; then
    echo "Error: Exporter folder $EXPORTER_DIR not found."
    exit 1
fi

# Check if the package file exists
if [ ! -f "$EXPORTER_DIR/$PACKAGE_FILE" ]; then
    echo "Error: Package $PACKAGE_FILE not found in $EXPORTER_DIR."
    exit 1
fi

# Navigate to the importer directory
echo "Navigating to $IMPORTER_DIR..."
cd "$IMPORTER_DIR" || { echo "Error: Could not navigate to $IMPORTER_DIR."; exit 1; }

echo "Cleaning existing versions of $PACKAGE_NAME..."
rm -f "${PACKAGE_NAME}-"*.tgz

# Copy package to importer directory
echo "Copying $PACKAGE_FILE to $IMPORTER_DIR..."
cp "$EXPORTER_DIR/$PACKAGE_FILE" . || { echo "Error: Could not copy $PACKAGE_FILE to $IMPORTER_DIR."; exit 1; }

# Install the package from the exporter repository
echo "Installing package $PACKAGE_FILE..."
npm install "$PACKAGE_FILE"

# Check if the installation was successful
if [ $? -eq 0 ]; then
    echo "Package $PACKAGE_FILE installed successfully in $IMPORTER_DIR!"
else
  echo "Error: Failed to install package $PACKAGE_FILE."
  exit 1
fi
