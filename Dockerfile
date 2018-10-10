FROM ubuntu:18.04

RUN apt-get update # 11 Oct 2018

##### ENV for nano terminal
ENV TERM=xterm

RUN echo "deb http://archive.canonical.com/ubuntu bionic partner" >> /etc/apt/sources.list && \
  echo "deb-src http://archive.canonical.com/ubuntu bionic partner" >> /etc/apt/sources.list && \
  apt-get update && apt-get install -y \
  git \
  make \
  curl \
  nano \
  libkrb5-dev \
  build-essential

RUN curl -sL https://deb.nodesource.com/setup_10.x| bash -&& \
  apt-get install nodejs -y

ADD index.js package.json package-lock.json /app/

RUN cd /app && \
	npm install

ENTRYPOINT ["node", "/app/index.js"]