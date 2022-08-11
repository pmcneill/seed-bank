#!/bin/bash

export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/n/bin
export N_PREFIX="/usr/local/n"

cd /web/seed-bank/backend
npm run server
