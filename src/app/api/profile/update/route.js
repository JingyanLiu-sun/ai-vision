import { auth } from "@/auth";
import { getPrisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, bio, image } = data;

    // Validate data if needed
    
    const prisma = getPrisma();
    
    const updatedUser = await prisma.users.update({
      where: {
        phone: session.user.phone, // Assuming phone is the unique identifier in session
      },
      data: {
        name,
        email,
        bio,
        image,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
