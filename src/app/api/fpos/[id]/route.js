import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    const fpo = await prisma.FPO.findUnique({
      where: { id },
      include: {
        commodity: true
      }
    })
    return NextResponse.json({ success: true, data: fpo })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const fpo = await prisma.FPO.update({
      where: { id },
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
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    const fpo = await prisma.FPO.delete({
      where: { id }
    })
    return NextResponse.json({ success: true, data: fpo })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
