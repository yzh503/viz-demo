import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(`
  type Data {
    date: String
    value: Float
  }

  type Query {
    points: [Data]
  }
`);

const generateDataPoints = (numPoints: number) => {
  let currentDate = new Date("2022-01-01");
  const results = [];

  for (let i = 0; i < numPoints; i++) {
    results.push({
      date: currentDate.toISOString().slice(0, 10), // Convert date to "YYYY-MM-DD" format
      value: Math.random() * 100
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return results;
}

const rootValue = {
  points: () => generateDataPoints(100)
}

export async function getValues(source: string) {
  const result = await graphql({ schema, source, rootValue });
  return result.data;
};
