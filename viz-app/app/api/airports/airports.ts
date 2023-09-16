import { MongoClient, ServerApiVersion }from 'mongodb';
import { graphql, buildSchema } from 'graphql';
import countries from 'i18n-iso-countries';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const uri = `mongodb+srv://yzh503:${process.env.MONGO_PASS}@free.7wxgtjb.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const schema = buildSchema(`
  type Airport {
    id: String,
    name: String,
    city: String,
    country: String,
    iata: String,
    icao: String,
    latitude: String,
    longitude: String,
    altitude: String,
    timezone: String,
    dst: String,
    tz: String,
    type: String,
    source: String
  }

  type Country {
    _id: String
    count: Int
  }

  type AirportHierarchy {
    name: String,
    value: Int,
    children: [AirportHierarchy]
  }

  type Query {
    airports: [Airport]
    numberOfIntlAirportsByCountry(limit: Int): [Country]
    hierarchicalAirports: [AirportHierarchy]
  }
`);

async function getAirportData() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('free');
    const collection = db.collection('openflights.airports');
    const data = await collection.find({}).toArray();
    return data;
  } finally {
    await mongoClient.close();
  }
}

async function getNumberOfIntlAirportsByCountry(limit?: number) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('free');
    const collection = db.collection('international-airports');
    
    let aggregationSteps = [
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];

    if (typeof limit === 'number') {
      (aggregationSteps as any[]).push({ $limit: limit });
    }

    let data = await collection.aggregate(aggregationSteps).toArray();
    return data;

  } finally {
    await mongoClient.close();
  }
}

async function getHierarchialAirportData() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('free');
    const collection = db.collection('international-airports-hierarchy');
    const data = await collection.find({}).toArray();
    return data;
  } finally {
    await mongoClient.close();
  }
}

const rootValue = {
  airports: () => getAirportData(),
  numberOfIntlAirportsByCountry: ({ limit }: { limit?: number }) => getNumberOfIntlAirportsByCountry(limit),
  hierarchicalAirports: () => getHierarchialAirportData()
}

export async function getAirports(source: string) {
  const result = await graphql({ schema, source, rootValue });
  return result.data;
};
