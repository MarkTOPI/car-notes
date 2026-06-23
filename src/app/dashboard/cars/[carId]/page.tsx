import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { DeleteCarButton } from "@/components/cars/delete-car-button";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

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

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

export default async function CarDetailsPage({ params }: Props) {
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
  });

  if (!car) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
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

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {car.name}
          </h1>

          <p className="mt-2 text-neutral-500">
            {car.plateNumber}
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/dashboard/cars/${car.id}/edit`}
            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Редактировать
          </Link>

          <DeleteCarButton carId={car.id} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-neutral-800">
            <div className="flex h-80 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
              {car.image ? (
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-7xl">🚗</div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 p-6 dark:border-neutral-800">
            <h2 className="text-xl font-semibold">
              Информация
            </h2>

            <dl className="mt-6 grid gap-4">
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 dark:border-neutral-900">
                <dt className="text-neutral-500">Пробег</dt>
                <dd>{car.mileage.toLocaleString("ru-RU")} км</dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 dark:border-neutral-900">
                <dt className="text-neutral-500">Тип кузова</dt>
                <dd>{formatBodyType(car.bodyType)}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 dark:border-neutral-900">
                <dt className="text-neutral-500">Цвет</dt>
                <dd>{car.color}</dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-neutral-500">Топливо</dt>
                <dd>{formatFuelType(car.fuelType)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-dashed border-neutral-300 p-6 dark:border-neutral-800">
            <h2 className="text-xl font-semibold">
              Заметки ТО
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Следующим этапом добавим записи о техническом обслуживании:
              дата, пробег, работы и стоимость.
            </p>

            <Link
              href={`/dashboard/cars/${car.id}/maintenance`}
              className="mt-5 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Открыть ТО
            </Link>
          </div>

          <div className="rounded-[2rem] border border-dashed border-neutral-300 p-6 dark:border-neutral-800">
            <h2 className="text-xl font-semibold">
              Расходы и действия
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Здесь будут заправки, ремонт, мойка, страховка, штрафы и другие
              расходы по автомобилю.
            </p>

            <Link
              href={`/dashboard/cars/${car.id}/expenses`}
              className="mt-5 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Открыть расходы
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}