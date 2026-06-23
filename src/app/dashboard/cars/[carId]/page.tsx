import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { DeleteCarButton } from "@/components/cars/delete-car-button";

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

function formatBodyType(type: string) {
  const types: Record<string, string> = {
    SEDAN: "Седан",
    CROSSOVER: "Кроссовер",
    SUV: "Внедорожник",
  };

  return types[type] || type;
}

function formatFuelType(type: string) {
  const types: Record<string, string> = {
    GASOLINE: "Бензин",
    DIESEL: "Дизель",
    HYBRID: "Гибрид",
    ELECTRIC: "Электро",
  };

  return types[type] || type;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU").format(date);
}

export default async function CarPage({ params }: Props) {
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
      maintenances: {
        orderBy: {
          serviceDate: "desc",
        },
      },
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

  const totalMaintenance = car.maintenances.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);

  const totalExpenses = car.expenses.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);

  const totalSpent = totalMaintenance + totalExpenses;

  const latestActions = [
    ...car.maintenances.map((item) => ({
      id: item.id,
      title: "ТО",
      description: item.description,
      date: item.serviceDate,
      mileage: item.mileage,
      cost: item.cost,
      href: `/dashboard/cars/${car.id}/maintenance`,
    })),
    ...car.expenses.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "Расход по автомобилю",
      date: item.expenseDate,
      mileage: item.mileage,
      cost: item.cost,
      href: `/dashboard/cars/${car.id}/expenses`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            ← Назад к автомобилям
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            CarNotes
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {car.name}
              </h1>

              <p className="mt-2 text-neutral-500">
                {car.plateNumber}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/dashboard/cars/${car.id}/edit`}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                Редактировать
              </Link>

              <DeleteCarButton carId={car.id} />
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            {car.image ? (
              <img
                src={car.image}
                alt={car.name}
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-neutral-100 text-6xl dark:bg-neutral-900">
                🚗
              </div>
            )}

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
                  <p className="text-neutral-500">Кузов</p>
                  <p className="mt-1 font-medium">
                    {formatBodyType(car.bodyType)}
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
                  <p className="text-neutral-500">Топливо</p>
                  <p className="mt-1 font-medium">
                    {formatFuelType(car.fuelType)}
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
                  <p className="text-neutral-500">Цвет</p>
                  <p className="mt-1 font-medium">
                    {car.color}
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
                  <p className="text-neutral-500">Пробег</p>
                  <p className="mt-1 font-medium">
                    {car.mileage.toLocaleString("ru-RU")} км
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
              <p className="text-sm text-neutral-500">
                Всего потрачено
              </p>

              <p className="mt-2 text-4xl font-semibold">
                {formatMoney(totalSpent)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-neutral-500">
                  ТО
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatMoney(totalMaintenance)}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Записей: {car.maintenances.length}
                </p>
              </div>

              <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-neutral-500">
                  Расходы
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatMoney(totalExpenses)}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Записей: {car.expenses.length}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href={`/dashboard/cars/${car.id}/maintenance`}
                className="rounded-[2rem] border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
              >
                <p className="text-sm text-neutral-500">
                  Сервисная история
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Открыть ТО
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  Масло, фильтры, ремонт и обслуживание.
                </p>
              </Link>

              <Link
                href={`/dashboard/cars/${car.id}/expenses`}
                className="rounded-[2rem] border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
              >
                <p className="text-sm text-neutral-500">
                  Финансы
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Открыть расходы
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  Заправки, мойки, штрафы, страховка и другие траты.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Последние записи
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Последние ТО и расходы по этому автомобилю.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/dashboard/cars/${car.id}/maintenance/new`}
                className="rounded-2xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
              >
                + ТО
              </Link>

              <Link
                href={`/dashboard/cars/${car.id}/expenses/new`}
                className="rounded-2xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
              >
                + Расход
              </Link>
            </div>
          </div>

          {latestActions.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
              <h3 className="text-lg font-medium">
                Записей пока нет
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Добавьте первое ТО или расход по этому автомобилю.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {latestActions.map((item) => (
                <Link
                  key={`${item.title}-${item.id}`}
                  href={item.href}
                  className="rounded-[1.5rem] border border-neutral-200 p-4 transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">
                        {formatDate(item.date)} · {item.mileage.toLocaleString("ru-RU")} км
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium dark:border-neutral-800">
                      {formatMoney(item.cost)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}