import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://yzh503:${process.env.MONGO_PASS}@free.7wxgtjb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
let db: any;

export async function getDatabase() {
  const database = client.db("free");
  return database;
}
