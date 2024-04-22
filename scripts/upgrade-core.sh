#!/usr/bin/env bash
# Upgrade core dependencies

# Check if venv is activated, activate if not
[ -z "$VIRTUAL_ENV" ] && source .venv/bin/activate

DIR=code/core
# Save the current requirements.txt as a temporary file
mv $DIR/requirements.txt $DIR/requirements.txt.tmp
echo "Upgrading core dependencies..."
pip install -U pip wheel setuptools django-ninja psycopg2-binary pydotplus six python-dotenv pillow django-extensions django-cors-headers >/dev/null
pip freeze > $DIR/requirements.txt
! cmp -s $DIR/requirements.txt $DIR/requirements.txt.tmp && {
    echo "Warning: Changes detected in core libs."
    diff $DIR/requirements.txt.tmp $DIR/requirements.txt
    cp $DIR/requirements.txt.tmp $DIR/requirements.txt.bak.$(date +"%Y%m%d%H%M%S")
} || echo "No changes detected in core libs."

rm $DIR/requirements.txt.tmp
