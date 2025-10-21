#!/bin/bash
set -e

echo "🚀 Starting Dev Container setup..."

echo "👤 Current user:"
whoami

echo "📁 install serena mcp server:"
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)

echo "📁 install chrome-devtools mcp server:"
claude mcp add chrome-devtools bunx chrome-devtools-mcp@latest

echo "📦 Installing dependencies..."
bun ci

# init and execute personal setup script
if [ ! -f ".devcontainer/setup.personal.sh" ]; then
  cat << 'EOF' > .devcontainer/setup.personal.sh
#!/bin/bash
set -e

# Your personal setup steps here
EOF
  chmod +x .devcontainer/setup.personal.sh
fi
echo "🔧 Running personal setup..."
bash .devcontainer/setup.personal.sh

echo "✨ Dev Container setup completed successfully!"