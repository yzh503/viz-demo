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
    id: String
    ident: String
    type: String
    name: String
    latitude_deg: String
    longitude_deg: String
    elevation_ft: String
    continent: String
    iso_country: String
    iso_region: String
    municipality: String
    scheduled_service: String
    gps_code: String
    iata_code: String
    local_code: String
    home_link: String
    wikipedia_link: String
    keywords: String
  }

  type Country {
    _id: String
    count: Int
  }

  type Query {
    airports: [Airport]
    numberOfAirportsByCountry(limit: Int): [Country]
  }
`);

async function getAirportData() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('free');
    const collection = db.collection('airports');
    const data = await collection.find({}).toArray();
    return data;
  } finally {
    await mongoClient.close();
  }
}

async function getNumberOfAirportsByCountry(limit?: number) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('free');
    const collection = db.collection('airports');
    
    let aggregationSteps = [
      { $group: { _id: "$iso_country", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];

    if (typeof limit === 'number') {
      (aggregationSteps as any[]).push({ $limit: limit });
    }

    let data = await collection.aggregate(aggregationSteps).toArray();

    data = data.map(item => ({
      ...item,
      _id: countries.getName(item._id, "en") || item._id
    }));

    return data;
  } finally {
    await mongoClient.close();
  }
}


const rootValue = {
  airports: () => getAirportData(),
  numberOfAirportsByCountry: ({ limit }: { limit?: number }) => getNumberOfAirportsByCountry(limit)
}

export async function getAirports(source: string) {
  const result = await graphql({ schema, source, rootValue });
  return result.data;
};
