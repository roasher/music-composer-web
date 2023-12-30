FROM ubuntu

SHELL ["/bin/bash", "--login", "-i", "-c"]

RUN apt update
RUN apt install python2 -y
RUN apt install curl -y
RUN apt install build-essential -y

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    source /root/.bashrc &&  \
    nvm install lts/carbon

COPY . piano-roll
WORKDIR piano-roll

RUN npm install
RUN npm rebuild node-sass

RUN node_modules/webpack/bin/webpack.js -d

ENTRYPOINT node_modules/http-server/bin/http-server