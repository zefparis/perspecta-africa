import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import db from "@/lib/db"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  locale: z.enum(["en", "fr", "pt"]).optional().default("en"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, locale } = registerSchema.parse(body)

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        locale,
      },
    })

    // Remove password from response
    // @ts-ignore - password exists on the user model but might not be in the generated type yet if types are stale
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: (error as any).errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
