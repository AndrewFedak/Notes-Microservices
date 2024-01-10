import amqplib, { Connection, Channel, ConsumeMessage } from 'amqplib'

type ExchangeTypes =
  | 'direct'
  | 'topic'
  | 'headers'
  | 'fanout'
  | 'match'
  | string

export let connection: Connection, channel: Channel

export async function publishToExchange(
  exchange: string,
  exchangeType: ExchangeTypes,
) {
  await channel.assertExchange(exchange, exchangeType, { durable: false })
  channel.publish(exchange, '', Buffer.from('Note updated'))
}

export async function consumeFromExchange(
  exchange: string,
  exchangeType: ExchangeTypes,
  onConsume: (msg: ConsumeMessage | null) => void,
) {
  await channel.assertExchange(exchange, exchangeType, { durable: false })
  const { queue } = await channel.assertQueue('', {
    exclusive: true,
  })
  await channel.bindQueue(queue, exchange, '')
  return await channel.consume(queue, onConsume, { noAck: true })
}

export async function rabbitMQConnect() {
  connection = await amqplib.connect(`amqp://${process.env.RABBIT_MQ_HOST}`)
  console.log(
    'Successfully connected to RabbitMQ on: ',
    process.env.RABBIT_MQ_HOST,
  )
  connection.on('error', () => {
    // recover or exit
  })

  channel = await connection.createChannel()
  channel.on('error', () => {
    // recover or exit
  })
  return connection
}
