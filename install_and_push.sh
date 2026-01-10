#!/usr/bin/env bash
set -euo pipefail

echo "== Start: install_and_push.sh =="
# Detect platform
OS="$(uname -s)"
echo "Platform: $OS"

# Function: try installers
try_install_node() {
  echo "Node not found. Attempting automatic install (may require admin privileges)..."
  # Prefer winget on Windows, then choco, then scoop
  if command -v winget >/dev/null 2>&1; then
    echo "Using winget to install Node LTS. If this fails, run Git Bash as Administrator or install Node from nodejs.org."
    winget install --id OpenJS.NodeJS.LTS -e || winget install --id OpenJS.NodeJS -e || { echo "winget install failed"; return 1; }
    return 0
  elif command -v choco >/dev/null 2>&1; then
    echo "Using Chocolatey to install Node LTS. This requires admin privileges."
    choco install nodejs-lts -y || { echo "choco install failed"; return 1; }
    return 0
  elif command -v scoop >/dev/null 2>&1; then
    echo "Using Scoop to install Node LTS."
    scoop install nodejs-lts || { echo "scoop install failed"; return 1; }
    return 0
  else
    echo "No supported installer found (winget / choco / scoop). Please install Node.js LTS manually from https://nodejs.org and re-run this script."
    return 2
  fi
}

# 1) Check node
if command -v node >/dev/null 2>&1; then
  echo "Node detected: $(node -v)"
else
  try_install_node || {
    code=$?
    if [ "$code" -eq 2 ]; then
      echo "Automatic installation not possible. Please install Node manually and re-run the script."
      exit 1
    else
      echo "Automatic installer failed. Please install Node manually from https://nodejs.org and re-run."
      exit 1
    fi
  }
fi

# 2) Verify npm
if ! command -v npm >/dev/null 2>&1; then
  echo "npm still not found after installation. Please ensure Node was installed correctly and in PATH."
  exit 1
fi

echo "npm: $(npm -v), node: $(node -v)"

# 3) Run npm install to generate package-lock.json
echo "Running npm install to generate package-lock.json..."
npm install

# 4) Git: add, commit, push package-lock.json
echo "Staging package-lock.json (if created) and committing..."
git add package-lock.json || echo "No package-lock.json to add."
if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "chore: add package-lock.json for CI" || { echo "Commit failed"; exit 1; }
fi

# 5) Push to main
echo "Pushing to origin main..."
git push origin main

echo "== Done: install_and_push.sh =="
