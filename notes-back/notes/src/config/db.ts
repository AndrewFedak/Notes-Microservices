import mongoose from 'mongoose'

export async function mongoDBConnect(): Promise<void> {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } =
    process.env
  const connectStr = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`

  try {
    await mongoose.connect(connectStr)
    console.log('Successfully connected to database')
  } catch (e) {
    console.log('DataBase connection failed. exiting now...')
    console.error(e)
    process.exit(1)
  }
}
