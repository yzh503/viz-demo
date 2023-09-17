import { getDatabase } from '../../MongoClient';
import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(`
  type Line {
    City1: String
    City2: String
    Month: Int
    Passenger_Trips: Int
    Aircraft_Trips: Int
    Passenger_Load_Factor: Int
    Distance: Int
    RPKs: Int
    ASKs: Int
    Seats: Int
    Year: Int
    Month_num: Int
  }

  type Traffic {
    name: String
    value: Int
    date: String
  }

  type Query {
    lines: [Line]
    intlTraffic: [Traffic]
  }
`);

async function getAusLineData() {
  try {
    const db = await getDatabase()
    const collection = db.collection('aus-city-pairs');
    const data = await collection.find({}).toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function getAusIntlTrafficData() {
  try {
    const db = await getDatabase()
    const collection = db.collection('aus-intl-traffic-predictions');
    const data = await collection.find({}).toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}

const rootValue = {
  lines: () => getAusLineData(),
  intlTraffic: () => getAusIntlTrafficData()
}

export async function getAirports(source: string) {
  const result = await graphql({ schema, source, rootValue });
  return result.data;
};
