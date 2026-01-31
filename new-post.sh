#!/bin/bash

# Get the title from the first argument
TITLE="$1"

# Check if a title was provided
if [ -z "$TITLE" ]; then
  echo "Please provide a title for the post."
  exit 1
fi

# Generate a slug from the title
SLUG=$(echo "$TITLE" | iconv -t ascii//TRANSLIT | sed -r s/[^a-zA-Z0-9]+/-/g | sed -r s/^-+\|-+$//g | tr A-Z a-z)

# Get the current date
DATE=$(date +%Y-%m-%d)

# Create the filename
FILENAME="src/content/blog/$DATE-$SLUG.md"

# Create the file with the frontmatter
cat > "$FILENAME" << EOL
---
title: "$TITLE"
description: "A short description of your post."
publishDate: $DATE
tags: []
# heroImage: "https://example.com/image.jpg" # Optional
isDraft: false
---

Write your post content here.
EOL

echo "Created new post: $FILENAME"
