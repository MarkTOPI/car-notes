import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { ExpensesList } from "@/components/expenses/expenses-list";

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ExpensesPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { carId } = await params;

  const car = await prisma.car.findFirst({
    where: {
      id: carId,
      userId: session.user.id,
    },
    include: {
      expenses: {
        orderBy: {
          expenseDate: "desc",
        },
      },
    },
  });

  if (!car) {
    notFound();
  }

  const total = car.expenses.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={`/dashboard/cars/${car.id}`}
              className="text-sm text-neutral-500 underline underline-offset-4"
            >
              ← Назад к автомобилю
            </Link>

            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
              CarNotes
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Расходы и действия
            </h1>

            <p className="mt-2 text-neutral-500">
              {car.name} · {car.plateNumber}
            </p>
          </div>

          <Link
            href={`/dashboard/cars/${car.id}/expenses/new`}
            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            + Добавить расход
          </Link>
        </header>

        <section className="mb-6 rounded-[2rem] border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-sm text-neutral-500">
            Всего расходов
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {formatMoney(total)}
          </p>
        </section>

        {car.expenses.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
            <h2 className="text-xl font-medium">
              Расходов пока нет
            </h2>

            <p className="mx-auto mt-2 max-w-md text-neutral-500">
              Добавьте первую запись: заправка, ремонт, мойка, страховка,
              штраф или другой расход.
            </p>

            <Link
              href={`/dashboard/cars/${car.id}/expenses/new`}
              className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              + Добавить расход
            </Link>
          </section>
        ) : (
          <ExpensesList
            carId={car.id}
            expenses={car.expenses.map((item) => ({
              id: item.id,
              carId: item.carId,
              title: item.title,
              expenseDate: item.expenseDate.toISOString(),
              mileage: item.mileage,
              description: item.description,
              cost: item.cost,
            }))}
          />
        )}
      </div>
    </main>
  );
}