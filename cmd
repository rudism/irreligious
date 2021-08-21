#!/usr/bin/env bash

cmd=$1

if [ "$cmd" = "lint" ]; then
  tslint --project .
elif [ "$cmd" = "build" ]; then
  tslint --project . && tsc
elif [ "$cmd" = "run" ]; then
  firefox public/index.html &
else
  echo "Usage: ./cmd lint     - lint"
  echo "       ./cmd build    - lint and compile"
  echo "       ./cmd run      - run in firefox"
fi
