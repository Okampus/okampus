#!/bin/bash

# Input and output paths
PRISMA_SCHEMA_FILE="apps/site/database/prisma/schema.prisma"
OUTPUT_FOLDER="libs/shared/enums/src/prisma"

# Delete the output folder and its contents if it exists
if [ -d "$OUTPUT_FOLDER" ]; then
  rm -r "$OUTPUT_FOLDER"
fi

# Ensure the output folder exists
mkdir -p $OUTPUT_FOLDER

# Read the Prisma schema file, extract enum definitions, and generate TypeScript enum files
awk '/enum [A-Za-z]+ \{/,/\}/' $PRISMA_SCHEMA_FILE | while IFS= read -r line; do
  if [[ $line =~ ^enum\ ([A-Za-z_]+)\ \{ ]]; then
    # Extract enum name
    enum_name="${BASH_REMATCH[1]}"
    # Convert enum name to kebab-case
    enum_kebab_name=$(echo "$enum_name" | awk '{
      output = ""
      for (i = 1; i <= length; i++) {
          char = substr($0, i, 1)
          if (char ~ /[A-Z]/) {
              output = output "-" tolower(char)
          } else {
              output = output char
          }
      }
      sub(/^-/, "", output)
      print output
    }')
    # Create the TypeScript enum file
    enum_file="$OUTPUT_FOLDER/$enum_kebab_name.enum.ts"
    echo "export enum $enum_name {" >$enum_file
  elif [[ $line =~ ^\ +([A-Za-z_]+)(\ +\/\/\ .+)?$ ]]; then
    # Extract enum value and comment
    enum_value="${BASH_REMATCH[1]}"
    enum_comment="${BASH_REMATCH[2]}"
    if [ -n "$enum_comment" ]; then
      # Add the enum value with comment
      echo "  $enum_value = '$enum_value',$enum_comment" >>$enum_file
    else
      # Add the enum value without a comment
      echo "  $enum_value = '$enum_value'," >>$enum_file
    fi
  elif [[ $line =~ ^\} ]]; then
    # Close the TypeScript enum definition
    echo "}" >>$enum_file
  fi
done

echo "TypeScript enum files generated in $OUTPUT_FOLDER"
