FROM node:22
COPY ./ /alisa
RUN set -ex &&\
    cd /alisa && \
    npm install

WORKDIR /alisa
USER node

