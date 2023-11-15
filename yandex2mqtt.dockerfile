FROM node:21

COPY . /opt/yandex2mqtt

RUN cd /opt/yandex2mqtt && \
    npm install

WORKDIR /opt/yandex2mqtt

VOLUME /opt/yandex2mqtt/data

ENV PATH_CONFIG="data/config"
ENV PATH_DEVICES="data/config.devices"

CMD node app.js \
    --log info \
    --db data/db.json \
    --cfg ${PATH_CONFIG} \
    --devices ${PATH_DEVICES} \
