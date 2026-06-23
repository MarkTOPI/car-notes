import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

export async function POST(
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
      title,
      expenseDate,
      mileage,
      description,
      cost,
    } = body;

    if (!title || !expenseDate || !mileage || !cost) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    const mileageNumber = Number(mileage);
    const costNumber = Number(cost);

    if (Number.isNaN(mileageNumber) || mileageNumber < 0) {
      return NextResponse.json(
        { error: "Пробег должен быть числом" },
        { status: 400 }
      );
    }

    if (Number.isNaN(costNumber) || costNumber < 0) {
      return NextResponse.json(
        { error: "Стоимость должна быть числом" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        carId,
        title,
        expenseDate: new Date(expenseDate),
        mileage: mileageNumber,
        description: description || null,
        cost: costNumber,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("CREATE_EXPENSE_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}