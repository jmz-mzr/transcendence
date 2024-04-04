#!/bin/sh

source /run/secrets/back-env
prisma db push --accept-data-loss
prisma studio &
exec nest start --watch --preserveWatchOutput
