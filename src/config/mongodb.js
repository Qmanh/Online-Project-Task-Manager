
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

//Khoi tao doi tuong trelloDatabaseInstance null (chua ket noi)
let trelloDatabaseInstance = null

//connect toi mongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  //ket noi thanh cong thi lay database theo ten va gan nguoc vao trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

// // //eport ra trello database instance sau khi connect thanh cong
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}

