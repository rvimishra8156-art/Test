#!/usr/bin/env bash
set -euo pipefail

GITHUB_USER="rvimishra8156-art"
REPO_NAME="Test"
REPO_FULL="${GITHUB_USER}/${REPO_NAME}"
BRANCH="main"
COMMIT_MSG="chore: initial Pluss Wood static site (Next.js export with GH Pages)"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh (GitHub CLI) not found. Install and run 'gh auth login' before running this script."
  exit 1
fi

echo "Checking gh authentication..."
if ! gh auth status >/dev/null 2>&1; then
  echo "You are not authenticated with gh. Please run 'gh auth login' and try again."
  exit 1
fi

echo
echo "You need to provide a Personal Access Token (PAT) with 'repo' scope."
read -s -p "Paste your PAT here (input hidden): " PAT
echo
if [ -z "$PAT" ]; then
  echo "No token provided. Exiting."
  exit 1
fi

echo "Ensuring repository ${REPO_FULL} exists..."
if gh repo view "$REPO_FULL" >/dev/null 2>&1; then
  echo "Repository exists: ${REPO_FULL}"
else
  echo "Creating repository ${REPO_FULL} (public) and pushing current content..."
  gh repo create "$REPO_FULL" --public --source=. --remote=origin --push || {
    echo "Failed to create repo via gh. Make sure you have permissions."
    exit 1
  }
fi

echo "Adding GH_PAGES_PAT secret to repository..."
echo -n "$PAT" | gh secret set GH_PAGES_PAT --repo "$REPO_FULL" --body-
echo "Secret GH_PAGES_PAT set."

if [ ! -d .git ]; then
  git init
  git checkout -b "$BRANCH" || git checkout "$BRANCH"
fi

REMOTE_URL="https://github.com/${REPO_FULL}.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git add -A
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "$COMMIT_MSG"
fi

git branch -M "$BRANCH"
echo "Pushing to origin/${BRANCH}..."
git push -u origin "$BRANCH"

echo
echo "Push complete. Open: https://github.com/${REPO_FULL}/actions to watch the workflow run."
echo "When finished, the site should be available at: https://${GITHUB_USER}.github.io/${REPO_NAME}/"