#!/bin/zsh

# make sure we are in the coasian source directory
dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd $dir

# load environment variables for production
source .env.prod

# get the latest commit hash as the docker version number
version=`git rev-parse --verify HEAD`

cd $dir/tob-web
yarn version minor

echo Building tob-web

docker build --build-arg NPM_TOKEN=${NPM_TOKEN} . -t tob-web --platform linux/amd64
docker tag tob-web ryanxcharles/tob-web:${version}
docker push ryanxcharles/tob-web:${version}

echo Deploying tob-web

ssh -i ~/.ssh/coasian.pem -t tob-web-1 "echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin"
ssh -i ~/.ssh/coasian.pem -t tob-web-1 'docker kill $(docker ps -q)'
ssh -i ~/.ssh/coasian.pem -t tob-web-1 'docker rm $(docker ps -a -q)'
ssh -i ~/.ssh/coasian.pem -t tob-web-1 "docker run --detach -p 80:3000 ryanxcharles/tob-web:${version}"
ssh -i ~/.ssh/coasian.pem -t tob-web-2 "echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin"
ssh -i ~/.ssh/coasian.pem -t tob-web-2 'docker kill $(docker ps -q)'
ssh -i ~/.ssh/coasian.pem -t tob-web-2 'docker rm $(docker ps -a -q)'
ssh -i ~/.ssh/coasian.pem -t tob-web-2 "docker run --detach -p 80:3000 ryanxcharles/tob-web:${version}"
