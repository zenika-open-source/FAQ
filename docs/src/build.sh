#!/bin/sh

# Remove previously generated files
rm -rf static/ public/ assets.json index.html index.mdx

# Create index.mdx based on README.md
(cat src/index.prefix.txt && cat ../README.md) > index.mdx

# Generate docz files
docz build

# Move into docs/
mv dist/* ./

# Delete empty directory
rmdir dist/