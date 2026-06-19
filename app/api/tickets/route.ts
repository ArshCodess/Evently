import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve the internal user from the clerkId stored in context
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all registrations for this user, including full event details
    const registrations = await prisma.registration.findMany({
      where: { userId: user.id },
      orderBy: { registeredAt: "desc" },
      select: {
        id: true,
        status: true,
        registeredAt: true,
        name: true,
        enrollmentNumber: true,
        course: true,
        year: true,
        group: true,
        phoneNumber: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            category: true,
            imageUrl: true,
          },
        },
      },
    });

    // Shape the response — mark tickets as expired if the event date has passed
    const now = new Date();

    const tickets = registrations.map((reg) => ({
      registrationId: reg.id,
      status: reg.status,
      registeredAt: reg.registeredAt,
      participant: {
        name: reg.name,
        enrollmentNumber: reg.enrollmentNumber,
        course: reg.course,
        year: reg.year,
        group: reg.group,
        phoneNumber: reg.phoneNumber,
      },
      event: {
        id: reg.event.id,
        title: reg.event.title,
        description: reg.event.description,
        date: reg.event.date,
        location: reg.event.location,
        category: reg.event.category,
        imageUrl: reg.event.imageUrl,
      },
      isExpired: reg.event.date < now,
    }));

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tickets]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}