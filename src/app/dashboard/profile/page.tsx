import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProfilePage() {
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
          maintenances: true,
          expenses: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalMaintenance = user.cars.reduce((sum, car) => {
    return sum + car.maintenances.reduce((carSum, item) => carSum + item.cost, 0);
  }, 0);

  const totalExpenses = user.cars.reduce((sum, car) => {
    return sum + car.expenses.reduce((carSum, item) => carSum + item.cost, 0);
  }, 0);

  const total = totalMaintenance + totalExpenses;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-neutral-500 underline underline-offset-4"
            >
              ← Назад к автомобилям
            </Link>

            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
              CarNotes
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Профиль
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/profile/edit"
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Настройки
            </Link>

            <ThemeToggle />

            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-col items-center text-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-black text-3xl font-semibold text-white dark:bg-white dark:text-black">
                  {initials}
                </div>
              )}

              <h2 className="mt-5 text-2xl font-semibold">
                {user.username}
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                {user.email}
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
                <p className="text-sm text-neutral-500">Автомобилей</p>
                <p className="mt-1 text-2xl font-semibold">{user.cars.length}</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
                <p className="text-sm text-neutral-500">Всего потрачено</p>
                <p className="mt-1 text-2xl font-semibold">{formatMoney(total)}</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
                <p className="text-sm text-neutral-500">ТО</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(totalMaintenance)}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
                <p className="text-sm text-neutral-500">Расходы</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  Мои автомобили
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Краткая информация по добавленным автомобилям.
                </p>
              </div>

              <Link
                href="/dashboard/cars/new"
                className="rounded-2xl bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
              >
                + Авто
              </Link>
            </div>

            {user.cars.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
                <h3 className="text-lg font-medium">
                  Автомобилей пока нет
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  Добавьте первый автомобиль на главной странице.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {user.cars.map((car) => {
                  const carMaintenance = car.maintenances.reduce(
                    (sum, item) => sum + item.cost,
                    0
                  );

                  const carExpenses = car.expenses.reduce(
                    (sum, item) => sum + item.cost,
                    0
                  );

                  return (
                    <Link
                      key={car.id}
                      href={`/dashboard/cars/${car.id}`}
                      className="rounded-[1.5rem] border border-neutral-200 p-4 transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {car.name}
                          </h3>

                          <p className="mt-1 text-sm text-neutral-500">
                            {car.plateNumber}
                          </p>

                          <p className="mt-2 text-sm text-neutral-500">
                            Пробег: {car.mileage.toLocaleString("ru-RU")} км
                          </p>
                        </div>

                        <div className="text-right text-sm">
                          <p className="text-neutral-500">Затраты</p>

                          <p className="mt-1 font-medium">
                            {formatMoney(carMaintenance + carExpenses)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}