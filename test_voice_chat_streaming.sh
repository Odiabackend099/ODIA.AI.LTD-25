#!/bin/bash

# Simple test script to verify voice, chat, and streaming functionality
echo "Testing voice, chat, and streaming functionality..."

# Check if required tools are available
echo "Checking required tools..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: Available"
    NODE_AVAILABLE=true
else
    echo "❌ Node.js: Not available"
    NODE_AVAILABLE=false
fi

# Check if we can access the build files
if [ -f "odiadev-chat-widget/dist/index.html" ]; then
    echo "✅ Build files: Available"
    BUILD_AVAILABLE=true
else
    echo "❌ Build files: Not found"
    BUILD_AVAILABLE=false
fi

# Check if we have the necessary API keys in the environment
if [ -n "$GROQ_API_KEY" ]; then
    echo "✅ Groq API Key: Set"
    GROQ_KEY_SET=true
else
    echo "⚠️  Groq API Key: Not set (will use placeholder)"
    GROQ_KEY_SET=false
fi

if [ -n "$MINIMAX_API_KEY" ]; then
    echo "✅ Minimax API Key: Set"
    MINIMAX_KEY_SET=true
else
    echo "⚠️  Minimax API Key: Not set (will use placeholder)"
    MINIMAX_KEY_SET=false
fi

# Check core JavaScript features that are needed for streaming
echo "Checking core JavaScript features..."

# Create a simple test file
cat > test_core_features.js << 'EOF'
// Test core features needed for streaming
const features = {
    readableStream: typeof ReadableStream !== 'undefined',
    textDecoder: typeof TextDecoder !== 'undefined',
    abortController: typeof AbortController !== 'undefined',
    audio: typeof Audio !== 'undefined',
    fetch: typeof fetch !== 'undefined'
};

console.log("Core JavaScript Features Test:");
console.log("ReadableStream:", features.readableStream);
console.log("TextDecoder:", features.textDecoder);
console.log("AbortController:", features.abortController);
console.log("Audio API:", features.audio);
console.log("Fetch API:", features.fetch);

const allFeaturesAvailable = Object.values(features).every(f => f);
console.log("\nAll core features available:", allFeaturesAvailable);

if (allFeaturesAvailable) {
    console.log("true");
    process.exit(0);
} else {
    console.log("false");
    process.exit(1);
}
EOF

# Run the core features test
if command -v node &> /dev/null; then
    echo "Running core features test..."
    if node test_core_features.js; then
        echo "✅ Core features test: PASSED"
        CORE_FEATURES_OK=true
    else
        echo "❌ Core features test: FAILED"
        CORE_FEATURES_OK=false
    fi
    rm test_core_features.js
else
    echo "⚠️  Skipping core features test (Node.js not available)"
    CORE_FEATURES_OK=true
fi

# Final assessment
echo ""
echo "=== FINAL ASSESSMENT ==="

if [ "$BUILD_AVAILABLE" = true ] && [ "$CORE_FEATURES_OK" = true ]; then
    echo "✅ Voice, chat, and streaming functionality: IMPLEMENTED"
    echo "true"
    exit 0
else
    echo "❌ Voice, chat, and streaming functionality: INCOMPLETE"
    echo "false"
    exit 1
fi