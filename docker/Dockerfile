#FROM node:22

FROM debian:12.8-slim
RUN set -ex &&\
    export nodevers="v22.0.0" &&\
    apt update &&\
    apt install wget -y &&\
    wget https://nodejs.org/dist/${nodevers}/node-${nodevers}-linux-x64.tar.gz &&\
    gunzip node-${nodevers}-linux-x64.tar.gz &&\
    tar xf node-${nodevers}-linux-x64.tar -C /usr/local --strip-components=1 --no-same-owner &&\
    rm -f https://nodejs.org/dist/v20.12.0/node-${nodevers}-linux-x64.tar &&\
    ln -s /usr/local/bin/node /usr/local/bin/nodejs &&\
    rm -rf /var/lib/apt/lists/* &&\
    groupadd -g 1000 alisa &&\
    useradd -g alisa -u 1000 alisa

COPY ./ /alisa
RUN set -ex &&\
    cd /alisa && \
    npm install

WORKDIR /alisa
ENTRYPOINT ["/usr/local/bin/node", "app"]
USER alisa

