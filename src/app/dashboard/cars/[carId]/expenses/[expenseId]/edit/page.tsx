import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { EditExpenseForm } from "@/components/expenses/edit-expense-form";

type Props = {
  params: Promise<{
    carId: string;
    expenseId: string;
  }>;
};

function formatDateForInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function EditExpensePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { carId, expenseId } = await params;

  const car = await prisma.car.findFirst({
    where: {
      id: carId,
      userId: session.user.id,
    },
  });

  if (!car) {
    notFound();
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      carId,
    },
  });

  if (!expense) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href={`/dashboard/cars/${car.id}/expenses`}
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            ← Назад к расходам
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            CarNotes
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Редактировать расход
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {car.name} · {car.plateNumber}
          </p>
        </header>

        <EditExpenseForm
          expense={{
            id: expense.id,
            carId: car.id,
            title: expense.title,
            expenseDate: formatDateForInput(expense.expenseDate),
            mileage: expense.mileage,
            description: expense.description || "",
            cost: expense.cost,
          }}
        />
      </div>
    </main>
  );
}