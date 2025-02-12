import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request) {
  // Extract id from the URL path
  const id = request.url.split('/').pop()

  try {
    const commodity = await prisma.commodity.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!commodity) {
      return NextResponse.json({ error: 'Commodity not found' }, { status: 404 })
    }

    return NextResponse.json(commodity)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch commodity' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    
    const commodity = await prisma.commodity.update({
      where: { id },
      data: {
        name: data.name,
        company: data.company,
        weight: parseInt(data.weight),
        longitude: parseFloat(data.longitude),
        latitude: parseFloat(data.latitude),
        // Not updating createdAt to maintain original order
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json({
      success: true,
      data: commodity
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    const commodity = await prisma.commodity.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      data: commodity
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
