#!/usr/bin/env bash

# Check if venv is activated, activate if not
[ -z "$VIRTUAL_ENV" ] && source .venv/bin/activate

code/core/manage.py makemigrations &&
code/core/manage.py migrate &&
code/core/manage.py runserver ||
echo "Error running server"
