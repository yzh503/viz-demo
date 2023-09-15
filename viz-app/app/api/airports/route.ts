import { NextResponse } from 'next/server'
import { getAirports } from './airports'

export async function POST(request: Request) {
  const rawBody = await request.text();
  const query = JSON.parse(rawBody).query;
  const values = await getAirports(query)
  return NextResponse.json(values)
}