import { NextResponse } from 'next/server'
import { getAirports } from './australian'

export async function POST(request: Request) {
  const rawBody = await request.text();
  let query = rawBody;
  try {
    query = JSON.parse(rawBody).query;
  } catch (e) {}
  const values = await getAirports(query)
  return NextResponse.json(values)
}