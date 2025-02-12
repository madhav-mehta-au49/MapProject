import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json({ 
      data: users,
      success: true,
      message: 'Users fetched successfully'
    })
  } catch (error) {
    return NextResponse.json({ 
      data: [], 
      success: false,
      error: error.message 
    }, { 
      status: 500 
    })
  } finally {
    await prisma.$disconnect()
  }
}
