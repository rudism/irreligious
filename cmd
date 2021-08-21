#!/usr/bin/env bash

cmd=$1

if [ "$cmd" = "build" ]; then
  tslint --project . && tsc
elif [ "$cmd" = "run" ]; then
  firefox public/index.html &
else
  echo "Usage: ./cmd build    - lint and compile"
  echo "       ./cmd run      - run in firefox"
fi
