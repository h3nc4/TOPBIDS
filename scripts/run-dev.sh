#!/usr/bin/env bash

# Check if venv is activated, activate if not
[ -z "$VIRTUAL_ENV" ] && source .venv/bin/activate

python3 code/core/manage.py makemigrations &&
python3 code/core/manage.py migrate &&
python3 code/core/manage.py runserver ||
echo "Error running server"
