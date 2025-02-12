import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const commodities = await prisma.commodity.findMany()
    return NextResponse.json({
      success: true,
      data: commodities || [],
      count: commodities?.length || 0
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: [],
      error: error.message,
      count: 0
    })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const commodity = await prisma.commodity.create({
      data: {
        name: data.name,
        company: data.company,
        weight: parseInt(data.weight),
        longitude: parseFloat(data.longitude),
        latitude: parseFloat(data.latitude)
      }
    })
    return NextResponse.json(commodity)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create commodity' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


