#!/usr/bin/env bash
set -euo pipefail

# Publish blog post to dev.to as a draft
# Usage: DEVTO_API_KEY=your_key ./scripts/publish-devto.sh

if [ -z "${DEVTO_API_KEY:-}" ]; then
  echo "Error: DEVTO_API_KEY environment variable is not set"
  echo "Usage: DEVTO_API_KEY=your_key $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEVTO_MD="$SCRIPT_DIR/../content/blog/agent-teams/devto.md"

if [ ! -f "$DEVTO_MD" ]; then
  echo "Error: $DEVTO_MD not found"
  exit 1
fi

# Extract frontmatter values
TITLE=$(sed -n 's/^title: "\(.*\)"/\1/p' "$DEVTO_MD")
DESCRIPTION=$(sed -n 's/^description: "\(.*\)"/\1/p' "$DEVTO_MD")
TAGS=$(sed -n 's/^tags: \(.*\)/\1/p' "$DEVTO_MD")
COVER_IMAGE=$(sed -n 's/^cover_image: \(.*\)/\1/p' "$DEVTO_MD")
CANONICAL_URL=$(sed -n 's/^canonical_url: \(.*\)/\1/p' "$DEVTO_MD")

# Extract body (everything after second ---)
BODY=$(awk 'BEGIN{n=0} /^---$/{n++; next} n>=2{print}' "$DEVTO_MD")

# Build JSON payload using python for proper escaping
PAYLOAD=$(python3 -c "
import json, sys
body = sys.stdin.read()
print(json.dumps({
    'article': {
        'title': '''$TITLE''',
        'body_markdown': body,
        'published': False,
        'tags': [t.strip() for t in '''$TAGS'''.split(',')],
        'cover_image': '''$COVER_IMAGE''',
        'canonical_url': '''$CANONICAL_URL''',
        'description': '''$DESCRIPTION'''
    }
}))
" <<< "$BODY")

echo "Publishing draft to dev.to..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "https://dev.to/api/articles" \
  -H "Content-Type: application/json" \
  -H "api-key: $DEVTO_API_KEY" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY_RESP=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  URL=$(echo "$BODY_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])")
  echo "✅ Draft published successfully!"
  echo "📝 Edit & review: https://dev.to/dashboard"
  echo "🔗 Article URL (once published): $URL"
else
  echo "❌ Failed with HTTP $HTTP_CODE"
  echo "$BODY_RESP" | python3 -m json.tool 2>/dev/null || echo "$BODY_RESP"
  exit 1
fi
