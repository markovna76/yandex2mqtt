module.exports =
{
  id: 'lamp_22_24_4',
  name: 'Ёлка',
  room: 'Кухня',
  type: 'devices.types.light',
  allowedUsers: [
    '2'
  ],
  mqtt: [
    {
      instance: 'on',
      set:   '/devices/wb-mr6cv3_20/controls/K1/on',
      state: '/devices/wb-mr6cv3_20/controls/K1/on'
    }
  ],
  valueMapping: [
    {
      type: 'on_off',
      mapping: [[false, true], [0, 1]]
    }
  ],
  capabilities: [
    {
      type: 'devices.capabilities.on_off',
      retrievable: true
    }
  ]
}
