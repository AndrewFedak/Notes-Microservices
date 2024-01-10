import mongoose from 'mongoose'

export async function mongoDBConnect(): Promise<typeof mongoose> {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } =
    process.env
  const connectStr = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`
  
  try {
    const mongooseConnection = await mongoose.connect(connectStr)
    console.log('Successfully connected to database')
    return mongooseConnection
  } catch (e) {
    console.log('DataBase connection failed. exiting now...')
    console.error(e)
    process.exit(1)
  }
}
