#!/bin/sh

if test -d ".venv"; then
    rm -r .venv
fi

python -m venv .venv || { echo 'FAILED: python -m venv .venv' ; exit 1; };

.venv/bin/python -m pip install -v --upgrade pip setuptools wheel || { echo 'FAILED: .venv/bin/python -m pip install --upgrade pip setuptools wheel' ; exit 1 ; };
