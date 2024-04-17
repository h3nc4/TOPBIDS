#!/usr/bin/env bash

# Check if venv is activated, activate if not
[ -z "$VIRTUAL_ENV" ] && source .venv/bin/activate

code/core/manage.py graph_models logic | dot -Tpng -o ./docs/imagens/Modelo-ER.png
