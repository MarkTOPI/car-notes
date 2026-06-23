import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { BodyType, FuelType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const { carId } = await params;

    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        userId: session.user.id,
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Автомобиль не найден" },
        { status: 404 }
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

    const updatedCar = await prisma.car.update({
      where: {
        id: carId,
      },
      data: {
        name,
        plateNumber,
        mileage: mileageNumber,
        bodyType,
        color,
        fuelType,
        image: image || null,
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("UPDATE_CAR_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const { carId } = await params;

    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        userId: session.user.id,
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Автомобиль не найден" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.maintenance.deleteMany({
        where: {
          carId,
        },
      }),

      prisma.expense.deleteMany({
        where: {
          carId,
        },
      }),

      prisma.car.delete({
        where: {
          id: carId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE_CAR_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}