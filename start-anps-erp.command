#!/bin/zsh
cd "$(dirname "$0")"
ANPS_ERP_PORT=4174 python3 anps_erp_backend.py
