import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    const importer = await prisma.importer.findUnique({
      where: { id },
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ success: true, data: importer })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const importer = await prisma.importer.update({
      where: { id },
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

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    const importer = await prisma.importer.delete({
      where: { id }
    })
    return NextResponse.json({ success: true, data: importer })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
