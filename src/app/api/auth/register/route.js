import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    console.log('Starting registration process')
    const { name, email, password } = await request.json()
    console.log('Received data:', { name, email })

    console.log('Starting password hash')
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Password hashed successfully')

    console.log('Attempting database insertion')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    console.log('Database insertion successful:', user.id)

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.log('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

