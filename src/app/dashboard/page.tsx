import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cars = await prisma.car.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              CarNotes
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Мои автомобили
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Добро пожаловать, {session.user.name}
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

        {cars.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
            <h2 className="text-xl font-medium">
              Пока автомобилей нет
            </h2>

            <p className="mx-auto mt-2 max-w-md text-neutral-500">
              Добавьте первый автомобиль, чтобы вести историю ТО, ремонта,
              заправок и расходов.
            </p>

            <Link
              href="/dashboard/cars/new"
              className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              + Добавить автомобиль
            </Link>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <Link
                key={car.id}
                href={`/dashboard/cars/${car.id}`}
                className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="flex h-44 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={car.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl">🚗</div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {car.name}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {car.plateNumber}
                      </p>
                    </div>

                    <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800">
                      {formatBodyType(car.bodyType)}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-neutral-500">
                    <p>
                      Пробег:{" "}
                      <span className="text-black dark:text-white">
                        {car.mileage.toLocaleString("ru-RU")} км
                      </span>
                    </p>

                    <p>
                      Топливо:{" "}
                      <span className="text-black dark:text-white">
                        {formatFuelType(car.fuelType)}
                      </span>
                    </p>

                    <p>
                      Цвет:{" "}
                      <span className="text-black dark:text-white">
                        {car.color}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}