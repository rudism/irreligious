#!/usr/bin/env bash

cmd=$1

if [ "$cmd" = "lint" ]; then
  eslint_d . --ext .ts
elif [ "$cmd" = "build" ]; then
  eslint_d . --ext .ts && tsc
elif [ "$cmd" = "run" ]; then
  firefox public/index.html &
else
  echo "Usage: ./cmd lint     - lint"
  echo "       ./cmd build    - lint and compile"
  echo "       ./cmd run      - run in firefox"
fi
