#!/usr/bin/env bash
# Upgrade core dependencies

# Check if venv is activated, activate if not
if [ -z "$VIRTUAL_ENV" ]; then
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    else
        echo "Virtual environment not found. Exiting."
        exit 1
    fi
fi

DIR="code/core"
# Check if the directory exists
if [ ! -d "$DIR" ]; then
    echo "Directory $DIR does not exist. Exiting."
    exit 1
fi

# Save the current requirements.txt as a temporary file
mv "$DIR/requirements.txt" "$DIR/requirements.txt.tmp"
if [ $? -ne 0 ]; then
    echo "Failed to move requirements.txt. Exiting."
    exit 1
fi

echo "Upgrading core dependencies..."
pip install -U pip wheel setuptools django-ninja psycopg2-binary pydotplus six python-dotenv pillow django-extensions django-cors-headers pyjwt python-ipware >/dev/null
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Exiting."
    mv "$DIR/requirements.txt.tmp" "$DIR/requirements.txt"  # Restore the original requirements.txt
    exit 1
fi

pip freeze > "$DIR/requirements.txt"

if ! cmp -s "$DIR/requirements.txt" "$DIR/requirements.txt.tmp"; then
    echo "Warning: Changes detected in core libs."
    diff "$DIR/requirements.txt.tmp" "$DIR/requirements.txt"
    cp "$DIR/requirements.txt.tmp" "$DIR/requirements.txt.bak.$(date +"%Y%m%d%H%M%S")"
else
    echo "No changes detected in core libs."
fi

rm "$DIR/requirements.txt.tmp"
