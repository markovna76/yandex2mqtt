FROM node:21

COPY . /opt/yandex2mqtt

RUN cd /opt/yandex2mqtt && \
    npm install

WORKDIR /opt/yandex2mqtt

VOLUME /opt/yandex2mqtt/data

CMD node app.js \
    --log info \
    --db data/db.json \
    --cfg data/config \
    --devices data/config.devices \
