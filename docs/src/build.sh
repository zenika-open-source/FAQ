#!/bin/sh

# Remove previously generated files
rm -rf docs/static/ docs/public/ docs/assets.json docs/index.html docs/index.mdx

# Create index.mdx based on README.md
(cat docs/src/index.prefix.txt && cat README.md) > docs/index.mdx

# Generate docz files
docz build

# Move into docs/
mv docs/dist/* docs/

# Delete empty directory
rmdir docs/dist