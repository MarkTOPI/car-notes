import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{
    carId: string;
    expenseId: string;
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

    const { carId, expenseId } = await params;

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

    const updatedExpense = await prisma.expense.updateMany({
      where: {
        id: expenseId,
        carId,
      },
      data: {
        title,
        expenseDate: new Date(expenseDate),
        mileage: mileageNumber,
        description: description || null,
        cost: costNumber,
      },
    });

    if (updatedExpense.count === 0) {
      return NextResponse.json(
        { error: "Расход не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("UPDATE_EXPENSE_ERROR", error);

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

    const { carId, expenseId } = await params;

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

    const deleted = await prisma.expense.deleteMany({
      where: {
        id: expenseId,
        carId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Расход не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE_EXPENSE_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}