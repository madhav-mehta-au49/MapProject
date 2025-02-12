import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    console.log('Starting registration process')
    const { name, email, password } = await request.json()
    console.log('Received data:', { name, email })

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
      })
  
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Hashed password')
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    console.log('User created:', user.id)

    return NextResponse.json({ 
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
