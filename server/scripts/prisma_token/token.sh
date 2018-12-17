#!/bin/sh

if [ $1 = "management" ]
then
  prisma cluster-token
else
  if [[ $1 =~ .*/.* ]]
  then
    PRISMA_URL="$PRISMA_URL/$1" prisma token
  else
    echo You need to use either \"service_name/service_stage\" or \"management\"
  fi
fi