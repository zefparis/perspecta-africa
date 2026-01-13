import { NextResponse } from "next/server"
import { auth } from "@/auth"
import db from "@/lib/db"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  image: z.string().url().optional().nullable(),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
})

export async function PUT(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validData = profileSchema.parse(body)

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...validData,
      },
    })

    // Remove password from response just in case (though update doesn't return it usually unless selected)
    // @ts-ignore
    const { password: _, ...userSafe } = updatedUser

    return NextResponse.json(userSafe)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        country: true,
        city: true,
        locale: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
