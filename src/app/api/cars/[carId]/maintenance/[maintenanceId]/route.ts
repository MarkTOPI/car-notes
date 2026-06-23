import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{
    carId: string;
    maintenanceId: string;
  }>;
};

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

    const { carId, maintenanceId } = await params;

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

    const deleted = await prisma.maintenance.deleteMany({
      where: {
        id: maintenanceId,
        carId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Запись ТО не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE_MAINTENANCE_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}