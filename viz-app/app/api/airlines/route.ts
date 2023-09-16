import { NextResponse } from 'next/server'
import { getAirports } from './airlines'

export async function POST(request: Request) {
  const rawBody = await request.text();
  let query = rawBody;
  try {
    query = JSON.parse(rawBody).query;
  } catch (e) {
    // do nothing
  }
  const values = await getAirports(query)
  return NextResponse.json(values)
}