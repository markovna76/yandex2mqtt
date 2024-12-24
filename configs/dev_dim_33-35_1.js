module.exports =
{
  id: 'dim_33-35_1',
  name: 'Свет',
  room: 'Кухня',
  type: 'devices.types.light',
  allowedUsers: [
    '2'
  ],
  mqtt: [
    {
      instance: 'brightness',
      set: '/devices/wb-mdm3_50/controls/Channel 1/on',
      state: '/devices/wb-mdm3_50/controls/Channel 1/on'
    },
    {
      instance: 'on',
      set:   '/devices/wb-mdm3_50/controls/K1/on',
      state: '/devices/wb-mdm3_50/controls/K1/on'
    }
  ],
  valueMapping: [
    {
      type: 'on_off',
      mapping: [[false, true], [0, 1]]
    },
    {
      type: 'on_off_test',
      mapping: function( device, instance, value, y2m) {
                // Просто демонстрация использования функции
                    logger.debug('Callback: ${device}, ${instance}, ${value}, ${y2m}')
                    if (value){
                          return 1
                        } else { return 0 }
                  }
    }
  ],
  capabilities: [
    {
      type: 'devices.capabilities.range',
      retrievable: true,
      parameters: {
        instance: 'brightness',
        unit: 'unit.percent',
        random_access: true,
        range: {
          min: 1,
          max: 100,
          precision: 30
        }
      }
    },
    {
      type: 'devices.capabilities.on_off',
      retrievable: true
    }
  ]
}
