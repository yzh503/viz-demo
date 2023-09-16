import { getDatabase } from '../../MongoClient';
import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(`
  type Airport {
    id: String
    name: String
    city: String
    country: String
    iata: String
    icao: String
    latitude: String
    longitude: String
    altitude: String
    timezone: String
    dst: String
    tz: String
    type: String
    source: String
  }

  type Country {
    _id: String
    count: Int
  }

  type AirportHierarchy {
    name: String
    value: Int
    children: [AirportHierarchy]
  }

  type Airline {
    name: String
    number_of_routes: Int
  }

  type City {
    name: String
    number_of_routes: Int
    in: Int
    out: Int
  }

  type Query {
    airports: [Airport]
    numberOfIntlAirportsByCountry(limit: Int): [Country]
    hierarchicalAirports: [AirportHierarchy]
    busiestAirlines(limit: Int): [Airline]
    busiestCities(limit: Int): [City]
  }
`);

async function getAirportData() {
  try {
    const db = await getDatabase()
    const collection = db.collection('openflights.airports');
    const data = await collection.find({}).toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function getNumberOfIntlAirportsByCountry(limit?: number) {
  try {
    const db = await getDatabase()
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

  } catch (e) {
    console.error(e);
  }
}

async function getHierarchialAirportData() {
  try {
    const db = await getDatabase()
    const collection = db.collection('international-airports-hierarchy');
    const data = await collection.find({}).toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}


async function getBusiestAirlines(limit: number) {
  try {
    const db = await getDatabase()
    const collection = db.collection('airline-business');
    const data = await collection.find({}).limit(limit).toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function getBusiestCities(limit: number) {
  try {
    const db = await getDatabase()
    const collection = db.collection('city-business');
    const data = await collection.find({}).limit(limit).toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}

const rootValue = {
  airports: () => getAirportData(),
  numberOfIntlAirportsByCountry: ({ limit }: { limit?: number }) => getNumberOfIntlAirportsByCountry(limit),
  hierarchicalAirports: () => getHierarchialAirportData(),
  busiestAirlines: ({ limit }: { limit: number }) => getBusiestAirlines(limit),
  busiestCities: ({ limit }: { limit: number }) => getBusiestCities(limit)
}

export async function getAirports(source: string) {
  const result = await graphql({ schema, source, rootValue });
  return result.data;
};
