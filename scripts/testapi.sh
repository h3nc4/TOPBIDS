#!/usr/bin/env bash

curl -LsX GET http://localhost:8000/api/status -H "Accept: application/json" | python -m json.tool
