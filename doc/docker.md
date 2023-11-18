# Docker

Приложение поддерживает работу в Docker.

## Доступные сборки

Мои сборки проекта: https://hub.docker.com/r/petrows/yandex2mqtt/tags

## Самостоятельная сборка

В корне проекта имеется DockerFile, для сборки выполнить:

```bash
docker build -t yandex2mqtt -f yandex2mqtt.dockerfile .
```

Запуск контейнера (данные приложения будут сохранены в папке `/tmp/y2m-data`):

```bash
# Создание папок данных
mkdir -p /tmp/y2m-data
# Копируем файл конфигурации. ВАЖНО: требует настройки, иначе контейнер не запустится
cp config.orig.js /tmp/y2m-data/config.js
cp config.devices.orig.js /tmp/y2m-data/config.devices.js
# Запуск контейнера
docker run -v /tmp/y2m-data:/opt/yandex2mqtt/data -v /tmp/y2m-data/config.js:/opt/yandex2mqtt/config.js -v /tmp/y2m-data/config.devices.js:/opt/yandex2mqtt/config.devices.js yandex2mqtt
```
