import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      cars: {
        orderBy: {
          createdAt: "desc",
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
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalCars = user.cars.length;

  const totalMileage = user.cars.reduce((sum, car) => {
    return sum + car.mileage;
  }, 0);

  const totalMaintenance = user.cars.reduce((sum, car) => {
    return (
      sum +
      car.maintenances.reduce((maintenanceSum, item) => {
        return maintenanceSum + item.cost;
      }, 0)
    );
  }, 0);

  const totalExpenses = user.cars.reduce((sum, car) => {
    return (
      sum +
      car.expenses.reduce((expenseSum, item) => {
        return expenseSum + item.cost;
      }, 0)
    );
  }, 0);

  const totalSpent = totalMaintenance + totalExpenses;

  const latestActions = user.cars
    .flatMap((car) => {
      const maintenances = car.maintenances.map((item) => ({
        id: item.id,
        carId: car.id,
        carName: car.name,
        title: "ТО",
        description: item.description,
        date: item.serviceDate,
        cost: item.cost,
        href: `/dashboard/cars/${car.id}/maintenance`,
      }));

      const expenses = car.expenses.map((item) => ({
        id: item.id,
        carId: car.id,
        carName: car.name,
        title: item.title,
        description: item.description || "Расход по автомобилю",
        date: item.expenseDate,
        cost: item.cost,
        href: `/dashboard/cars/${car.id}/expenses`,
      }));

      return [...maintenances, ...expenses];
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              CarNotes
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Мои автомобили
            </h1>

            <p className="mt-2 text-neutral-500">
              Добро пожаловать, {user.username}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/profile"
              className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              Профиль
            </Link>

            <ThemeToggle />

            <Link
              href="/dashboard/cars/new"
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              + Добавить автомобиль
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500">
              Автомобилей
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {totalCars}
            </p>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500">
              Общий пробег
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {totalMileage.toLocaleString("ru-RU")} км
            </p>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500">
              ТО
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {formatMoney(totalMaintenance)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500">
              Всего потрачено
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {formatMoney(totalSpent)}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  Автомобили
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Список автомобилей и краткая статистика по каждому.
                </p>
              </div>
            </div>

            {user.cars.length === 0 ? (
              <section className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
                <h2 className="text-xl font-medium">
                  Автомобилей пока нет
                </h2>

                <p className="mx-auto mt-2 max-w-md text-neutral-500">
                  Добавьте первый автомобиль, чтобы вести историю ТО,
                  расходов и действий.
                </p>

                <Link
                  href="/dashboard/cars/new"
                  className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
                >
                  + Добавить автомобиль
                </Link>
              </section>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {user.cars.map((car) => {
                  const carMaintenance = car.maintenances.reduce(
                    (sum, item) => sum + item.cost,
                    0
                  );

                  const carExpenses = car.expenses.reduce(
                    (sum, item) => sum + item.cost,
                    0
                  );

                  const carTotal = carMaintenance + carExpenses;

                  return (
                    <Link
                      key={car.id}
                      href={`/dashboard/cars/${car.id}`}
                      className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={car.name}
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center bg-neutral-100 text-4xl dark:bg-neutral-900">
                          🚗
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {car.name}
                            </h3>

                            <p className="mt-1 text-sm text-neutral-500">
                              {car.plateNumber}
                            </p>
                          </div>

                          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800">
                            {formatBodyType(car.bodyType)}
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
                            <p className="text-neutral-500">Пробег</p>
                            <p className="mt-1 font-medium">
                              {car.mileage.toLocaleString("ru-RU")} км
                            </p>
                          </div>

                          <div className="rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
                            <p className="text-neutral-500">Затраты</p>
                            <p className="mt-1 font-medium">
                              {formatMoney(carTotal)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
                            <p className="text-neutral-500">Топливо</p>
                            <p className="mt-1 font-medium">
                              {formatFuelType(car.fuelType)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
                            <p className="text-neutral-500">Цвет</p>
                            <p className="mt-1 font-medium">
                              {car.color}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-2xl font-semibold">
              Последние действия
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              ТО и расходы по всем автомобилям.
            </p>

            {latestActions.length === 0 ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-800">
                <p className="text-sm text-neutral-500">
                  Действий пока нет
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                {latestActions.map((item) => (
                  <Link
                    key={`${item.title}-${item.id}`}
                    href={item.href}
                    className="rounded-[1.5rem] border border-neutral-200 p-4 transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-neutral-500">
                          {formatDate(item.date)} · {item.carName}
                        </p>

                        <h3 className="mt-1 font-medium">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-sm font-medium">
                        {formatMoney(item.cost)}
                      </p>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}