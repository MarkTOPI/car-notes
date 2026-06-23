import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { BodyType, FuelType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      plateNumber,
      mileage,
      bodyType,
      color,
      fuelType,
      image,
    } = body;

    if (!name || !plateNumber || !mileage || !bodyType || !color || !fuelType) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    if (!Object.values(BodyType).includes(bodyType)) {
      return NextResponse.json(
        { error: "Некорректный тип кузова" },
        { status: 400 }
      );
    }

    if (!Object.values(FuelType).includes(fuelType)) {
      return NextResponse.json(
        { error: "Некорректный тип топлива" },
        { status: 400 }
      );
    }

    const mileageNumber = Number(mileage);

    if (Number.isNaN(mileageNumber) || mileageNumber < 0) {
      return NextResponse.json(
        { error: "Пробег должен быть числом" },
        { status: 400 }
      );
    }

    const car = await prisma.car.create({
      data: {
        userId: session.user.id,
        name,
        plateNumber,
        mileage: mileageNumber,
        bodyType,
        color,
        fuelType,
        image: image || null,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("CREATE_CAR_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}