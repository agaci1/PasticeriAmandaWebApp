#!/bin/bash

# Test script for upload functionality
echo "Testing upload functionality..."

# Test the uploads directory
echo "=== Testing uploads directory ==="
if [ -d "uploads" ]; then
    echo "✅ uploads directory exists"
    echo "📁 Contents:"
    ls -la uploads/
else
    echo "❌ uploads directory does not exist"
    echo "Creating uploads directory..."
    mkdir -p uploads
    echo "✅ Created uploads directory"
fi

# Test file permissions
echo ""
echo "=== Testing file permissions ==="
if [ -w "uploads" ]; then
    echo "✅ uploads directory is writable"
else
    echo "❌ uploads directory is not writable"
fi

# Test Railway volume mount
echo ""
echo "=== Testing Railway volume mount ==="
if [ ! -z "$RAILWAY_VOLUME_MOUNT_PATH" ]; then
    echo "✅ RAILWAY_VOLUME_MOUNT_PATH is set: $RAILWAY_VOLUME_MOUNT_PATH"
    if [ -d "$RAILWAY_VOLUME_MOUNT_PATH/uploads" ]; then
        echo "✅ Railway uploads directory exists"
        echo "📁 Contents:"
        ls -la "$RAILWAY_VOLUME_MOUNT_PATH/uploads/"
    else
        echo "❌ Railway uploads directory does not exist"
    fi
else
    echo "ℹ️  RAILWAY_VOLUME_MOUNT_PATH is not set (running locally)"
fi

echo ""
echo "=== Test complete ===" 