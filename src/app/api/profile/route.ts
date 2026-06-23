import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { username, email, avatar } = body;

    if (!username || !email) {
      return NextResponse.json(
        { error: "Имя и email обязательны" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = String(username).trim();
    const normalizedAvatar = avatar ? String(avatar).trim() : null;

    if (normalizedUsername.length < 2) {
      return NextResponse.json(
        { error: "Имя должно быть не короче 2 символов" },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Введите корректный email" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Этот email уже используется" },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        avatar: normalizedAvatar,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}