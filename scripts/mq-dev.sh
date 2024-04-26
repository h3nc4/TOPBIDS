#!/usr/bin/env bash

docker run -d --hostname topbids --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3
