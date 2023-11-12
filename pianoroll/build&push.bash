#!/bin/bash
set -e

VERSION=$(cat version.txt)
if [ -z "$VERSION"]; then
  exit "Version can't be blank"
else
  echo "Processing version: $VERSION"
fi

docker login
docker build -t container .

docker tag container roasher/ru.yurkins-workshop.music-composer-web:$VERSION
docker push roasher/ru.yurkins-workshop.music-composer-web:$VERSION