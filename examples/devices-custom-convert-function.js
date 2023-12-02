/*
    Пример использования кастомной функции конвертации,
    удобно, когда нужно репортить/управлять статусом включения устройства,
    исходя из како-то состояния.

    Пример:
    * Отоплление "включено" или "выключено" в засисимости от установленной температуры
    * Шторы "открыты" или "закрыты" в засисимости от % открытия
*/

module.exports = {
    devices: [
        {
            id: 'kg_heating',
            type: 'devices.types.thermostat',
            name: 'Отопление',
            description: '',
            room: 'Кабинет',
            mqtt: [
                {
                    instance: 'on',
                    // Инстанс - ВКЛ/ВЫКЛ, но управляется тем же топиком, что и температура,
                    // т.к. конвертация в статус включено конвертируется функцией (см ниже)
                    set: 'eventbus/set/kg_heating_thermostat/temperature',
                    state: 'eventbus/state/kg_heating_thermostat'
                },
                {
                    instance: 'temperature',
                    set: 'eventbus/set/kg_heating_thermostat/temperature',
                    state: 'eventbus/state/kg_heating_thermostat'
                }
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                    reportable: true,
                },
                {
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
                        },
                    },
                }
            ],
            valueMapping: [
                {
                    type: 'on_off',
                    mapping: function(device, value, y2m) {
                        // Кастомная функция конвертации
                        // device: объект устройства (если нужны какие-то свойства)
                        // value: значение
                        // y2m: направление конвертации, true = Яндекс -> MQTT
                        // Сообщим в лог
                        logger.debug(`Callback: ${device}, ${value}, ${y2m}`)
                        // Направление:
                        if (y2m) { // От Яндекс в MQTT
                            // Если приходит команда "ВКЛЮЧИ" (true) -> 25°C
                            // ВЫКЛЮЧИ -> 5°C
                            return value ? 23 : 5
                        } else { // От MQTT в Яндекс
                            // Если температура больше 17°C -> репортим ВКЛ, иначе ВЫКЛ
                            return value > 17
                        }
                    }
                }
            ]
        },
    ],
};
