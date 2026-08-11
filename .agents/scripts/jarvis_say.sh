#!/bin/bash
# JARVIS Free macOS Text-To-Speech Helper Script
# Usage: ./jarvis_say.sh "Good day, sir. All systems operational."

TEXT="${1:-Good day, sir. All systems are online and connected to Personal OS.}"

# Check available natural UK voices (Daniel is standard on macOS)
if say -v "?" | grep -q "Daniel"; then
    say -v Daniel "$TEXT"
elif say -v "?" | grep -q "Oliver"; then
    say -v Oliver "$TEXT"
else
    say "$TEXT"
fi
