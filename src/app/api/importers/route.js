import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const importers = await prisma.importer.findMany({
      include: {
        commodity: true
      }
    })

    // Always return a valid response object
    return NextResponse.json({
      success: true,
      data: importers || [],
      count: importers?.length || 0
    })

  } catch (error) {
    // Return error response with empty data array
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
    const importer = await prisma.importer.create({
      data: {
        name: data.name,
        company: data.company,
        location: data.location,
        quantity_mt: parseInt(data.quantity_mt),
        year: parseInt(data.year),
        longitude: parseFloat(data.longitude),
        latitude: parseFloat(data.latitude),
        commodityId: parseInt(data.commodityId)
      },
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ success: true, data: importer })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
