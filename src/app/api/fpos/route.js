import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const commodity = searchParams.get('commodity')
  
  try {
    const fpos = await prisma.FPO.findMany({  // This matches your schema exactly
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ data: fpos || [] }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ data: [], error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const fpo = await prisma.FPO.create({
      data: {
        name: data.name,
        location: data.location,
        members: parseInt(data.members),
        commodityId: parseInt(data.commodityId)
      },
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ success: true, data: fpo })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

