import { MongoClient, ServerApiVersion }from 'mongodb';
import { graphql, buildSchema } from 'graphql';

const uri = `mongodb+srv://yzh503:${process.env.MONGO_PASS}@free.7wxgtjb.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const schema = buildSchema(`
  type Business {
    name: String, 
    number_of_routes: Int
  }

  type Query {
    busiestAirlines(limit: Int): [Business]
  }
`);

async function getBusiestAirlines(limit: number) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('free');
    const collection = db.collection('airline-business');
    const data = await collection.find({}).limit(limit).toArray();
    return data;
  } finally {
    await mongoClient.close();
  }
}

const rootValue = {
  busiestAirlines: ({ limit }: { limit: number }) => getBusiestAirlines(limit)
}

export async function getAirports(source: string) {
  const result = await graphql({ schema, source, rootValue });
  return result.data;
};
