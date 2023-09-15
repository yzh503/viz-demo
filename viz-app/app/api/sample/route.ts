import { NextResponse } from 'next/server'
import { getValues } from './data'

export async function POST(request: Request) {
  const rawBody = await request.text();
  const values = await getValues(rawBody)
  return NextResponse.json(values)
}