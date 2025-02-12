import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const commodity = searchParams.get('commodity')
  try {
    const exporters = await prisma.exporter.findMany({
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ data: exporters || [] }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ data: [], error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


export async function POST(request) {
  try {
    const data = await request.json()
    const exporter = await prisma.exporter.create({
      data: {
        name: data.name,
        company: data.company,
        location: data.location,
        quantity_mt: parseInt(data.quantity_mt),
        year: parseInt(data.year),
        commodityId: parseInt(data.commodityId)
      },
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ success: true, data: exporter })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
