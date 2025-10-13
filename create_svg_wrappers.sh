#!/bin/bash

# Create SVG wrappers for icons using Inkscape CLI
# Usage: ./create_svg_wrappers.sh

TOOLS_DIR="./public/icons/tools"
SOCIALS_DIR="./public/icons/socials"
OUTPUT_SUFFIX="_wrapped"

# Function to create SVG wrapper
create_wrapper() {
    local input_file="$1"
    local output_file="$2"
    
    # Get filename without extension
    local basename=$(basename "$input_file" | sed 's/\.[^.]*$//')
    local output_path="${output_file%/*}/${basename}${OUTPUT_SUFFIX}.svg"
    
    echo "Processing: $input_file -> $output_path"
    
    # Use Inkscape to create a clean SVG wrapper
    inkscape "$input_file" \
        --export-type=svg \
        --export-filename="$output_path" \
        --export-plain-svg \
        --export-text-to-path
}

# Process tools directory
echo "Processing tools icons..."
for file in "$TOOLS_DIR"/*.svg; do
    if [ -f "$file" ]; then
        create_wrapper "$file" "$file"
    fi
done

# Process socials directory (handle both SVG and other formats)
echo "Processing socials icons..."
for file in "$SOCIALS_DIR"/*; do
    if [ -f "$file" ]; then
        create_wrapper "$file" "$file"
    fi
done

echo "SVG wrapper creation complete!"
