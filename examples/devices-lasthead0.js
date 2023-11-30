module.exports = {
    devices: [
        {
            id: 'haw-002-switch',
            name: 'Свет в коридоре',
            room: 'Коридор',
            type: 'devices.types.light',
            allowedUsers: ['2'],
            mqtt: [
                {
                    instance: 'on',
                    set: '/yandex/controls/light_HaW_002/on',
                    state: '/yandex/controls/light_HaW_002/on/state',
                },
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                },
            ],
        },

        {
            id: 'lvr-003-switch',
            name: 'Основной свет',
            room: 'Гостиная',
            type: 'devices.types.light',
            allowedUsers: ['2'],
            mqtt: [
                {
                    instance: 'on',
                    set: '/yandex/controls/light_LvR_003/on',
                    state: '/yandex/controls/light_LvR_003/on/state',
                },
            ],
            valueMapping: [
                {
                    type: 'on_off',
                    mapping: [[false, true], [0, 1]], // [yandex, mqtt]
                },
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                },
            ],
        },

        {
            id: 'lvr-001-weather',
            name: 'В гостиной',
            room: 'Гостиная',
            type: 'devices.types.sensor',
            allowedUsers: ['2'],
            mqtt: [
                {
                    instance: 'temperature',
                    state: '/yandex/sensors/LvR_001_Weather/temperature',
                },
                {
                    instance: 'humidity',
                    state: '/yandex/sensors/LvR_001_Weather/humidity',
                },
            ],
            properties: [
                {
                    type: 'devices.properties.float',
                    retrievable: true,
                    parameters: {
                        instance: 'temperature',
                        unit: 'unit.temperature.celsius',
                    },
                },
                {
                    type: 'devices.properties.float',
                    retrievable: true,
                    parameters: {
                        instance: 'humidity',
                        unit: 'unit.percent',
                    },
                },
            ],
        },

        {
            id: 'plug-001-flower',
            name: 'Розетка для цветка',
            room: 'Гостиная',
            type: 'devices.types.socket',
            allowedUsers: ['2'],
            mqtt: [
                {
                    instance: 'on',
                    set: '/yandex/controls/socket_LvR_002/on',
                    state: '/yandex/controls/socket_LvR_002/on/state',
                },
                {
                    instance: 'power',
                    state: '/yandex/controls/socket_LvR_002/power',
                },
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                },
            ],
            properties: [
                {
                    type: 'devices.properties.float',
                    retrievable: true,
                    parameters: {
                        instance: 'power',
                        unit: 'unit.watt',
                    },
                },
            ],
        },
        {
            id: 'haw-001-motion',
            name: 'Движение',
            room: 'Коридор',
            type: 'devices.types.sensor',
            allowedUsers: ['2'],
            mqtt: [
                {
                    instance: 'motion',
                    state: '/yandex/sensors/HaW_001_Motion/motion',
                },
            ],
            valueMapping: [
                {
                    type: 'event',
                    mapping: [['not_detected', 'detected'], ['false', 'true']], // [yandex, mqtt]
                },
            ],
            properties: [
                {
                    type: 'devices.properties.event',
                    retrievable: true,
                    parameters: {
                        instance: 'motion',
                        events: [{
                            value: 'detected'
                        },
                        {
                            value: 'not_detected'
                        }]
                    },
                },
            ],
        },
        /* --- end */
    ],
};
