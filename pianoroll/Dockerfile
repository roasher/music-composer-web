FROM ubuntu

SHELL ["/bin/bash", "--login", "-i", "-c"]

RUN apt update
RUN apt install python2 -y
RUN apt install curl -y
RUN apt install build-essential -y

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    source /root/.bashrc &&  \
    nvm install 8.10.0

COPY . piano-roll
WORKDIR piano-roll

RUN npm install
RUN npm install sass-loader@1.0.4
#RUN npm uninstall --save-dev node-sass@4.14.1
#RUN npm install --save-dev node-sass@4.14.1

RUN node_modules/webpack/bin/webpack.js -d

ENTRYPOINT node_modules/http-server/bin/http-server