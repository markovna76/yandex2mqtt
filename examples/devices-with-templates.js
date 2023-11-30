/*

Config for Yandex2mqtt bridge

To expose devices to Yandex Smart Home and Alice smart station.

Config for PWS fork: https://github.com/petrows/yandex2mqtt

*/

// Preambula: define helpers, to avoid duplicating

class GenDevice {
    data = {}
    constructor(options) {
        this.data = {}
        this.data.id = options.id
        this.data.type = options.type
        this.data.name = options.name || 'Без названия'
        this.data.description = options.description || ''
        this.data.room = options.room || ''
        this.data.mqtt = []
        this.data.capabilities = []
        this.data.properties = []
    }

    toConfig() {
        return this.data
    }

    addMQTT(instance, set, state) {
        this.data.mqtt.push({
            instance: instance,
            set: 'eventbus/set/' + set,
            state: 'eventbus/state/' + state,
        })
    }
    addCapability(cap) {
        this.data.capabilities.push(cap)
    }
    addProperty(prop) {
        this.data.properties.push(prop)
    }
}

const LIGHT = {
    SW: 'sw', // Simple, on/off
    DIM: 'dim', // on/off, dimmer
    CT: 'ct', // on/off, dimmer, Color temperature
    RGB: 'rgb', // on/off, dimmer, RGB
}

function Light(type, options) {
    if (!options.type) { options.type = 'devices.types.light' }
    let dev = new GenDevice(options)
    // Special suffux for buggy devices (use not real item, but proxy)
    let suffix = options.proxy ? '_proxy' : ''
    // All lights can ON/OFF
    dev.addMQTT('on', options.id + '_sw' + suffix + '/sw', options.id + '_sw' + suffix)
    dev.addCapability({
        type: 'devices.capabilities.on_off',
        retrievable: true,
        reportable: true,
        state: {
            instance: 'on',
            value: false,
        },
    })
    // Device can DIM?
    if ([LIGHT.DIM, LIGHT.CT, LIGHT.RGB].includes(type)) {
        dev.addMQTT('brightness', options.id + '_dim/dim', options.id + '_dim')
        dev.addCapability({
            type: 'devices.capabilities.range',
            retrievable: true,
            reportable: true,
            parameters: {
                instance: 'brightness',
                unit: 'unit.percent',
                range: {
                    min: 1,
                    max: 100,
                    precision: 10
                }
            },
            state: {
                instance: 'brightness',
                value: 0,
            },
        })
    }
    // Device can CT?
    if ([LIGHT.CT].includes(type)) {
        dev.addMQTT('temperature_k', options.id + '_ct/ct_k', options.id + '_ct/ct_k')
        dev.addCapability({
            type: 'devices.capabilities.color_setting',
            retrievable: true,
            reportable: true,
            parameters: {
                instance: 'temperature_k',
                temperature_k: {
                    min: 2500,
                    max: 4000,
                }
            },
            state: {
                instance: 'temperature_k',
                value: 0,
            },
        })
    }
    // Device can RGB?
    if ([LIGHT.RGB].includes(type)) {
        dev.addMQTT('rgb', options.id + '_color/rgb_int', null)
        dev.addCapability({
            type: 'devices.capabilities.color_setting',
            retrievable: true,
            reportable: true,
            parameters: {
                color_model: 'rgb',
            },
            state: {
                instance: 'rgb',
                value: 0,
            },
        })
    }
    return dev.toConfig()
}

function Thermostat(options) {
    if (!options.type) { options.type = 'devices.types.thermostat' }
    let dev = new GenDevice(options)
    // On/Off control
    dev.addMQTT('on', options.id + '_thermostat_enable', options.id + '_thermostat_enable')
    dev.addCapability({
        type: 'devices.capabilities.on_off',
        retrievable: true,
        reportable: true,
        state: {
            instance: 'on',
            value: false,
        },
    })
    // Temperature control
    dev.addMQTT('temperature', options.id + '_thermostat/temperature', options.id + '_thermostat')
    dev.addCapability({
        type: 'devices.capabilities.range',
        retrievable: true,
        reportable: true,
        parameters: {
            instance: 'temperature',
            unit: 'unit.temperature.celsius',
            range: {
                min: 5,
                max: 30,
                precision: 1
            }
        },
        state: {
            instance: 'temperature',
            value: 0,
        },
    })
    dev.addProperty({
        type: 'devices.properties.float',
        retrievable: true,
        reportable: true,
        parameters: {
            instance: 'temperature',
            unit: 'unit.temperature.celsius',
        },
        state: {
            instance: 'temperature',
            value: 0,
        },
    })
    return dev.toConfig()
}

const ROOMS = {
    LOBBY: 'Прихожая',
    WC: 'Ванная',
    KG_CABINET: 'Кабинет',
}

module.exports = {
    devices: [
        // Corridor
        Light(LIGHT.DIM, {
            id: 'fl_up_light',
            name: 'Верхний',
            room: ROOMS.LOBBY,
        }),
        Light(LIGHT.DIM, {
            id: 'eg_decoration_light',
            name: 'Комод',
            room: ROOMS.LOBBY,
        }),
        // WC
        Light(LIGHT.CT, {
            id: 'bz_light_1',
            name: 'Верхний туалет',
            room: ROOMS.WC,
            proxy: true,
        }),
        Light(LIGHT.CT, {
            id: 'bz_light_2',
            name: 'Верхний душ',
            room: ROOMS.WC,
            proxy: true,
        }),
        Light(LIGHT.SW, {
            id: 'bz_mirror',
            name: 'Зеркало',
            room: ROOMS.WC,
        }),
        // KG (Cabinet)
        Light(LIGHT.CT, {
            id: 'desktop_petro_light',
            name: 'Стол',
            room: ROOMS.KG_CABINET,
        }),
        Thermostat({
            id: 'kg_heating',
            name: 'Отопление',
            room: ROOMS.KG_CABINET,
        })
    ],
};
