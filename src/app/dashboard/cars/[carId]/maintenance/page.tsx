import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { DeleteMaintenanceButton } from "@/components/maintenance/delete-maintenance-button";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU").format(date);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function MaintenancePage({ params }: Props) {
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
    },
  });

  if (!car) {
    notFound();
  }

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
              Заметки ТО
            </h1>

            <p className="mt-2 text-neutral-500">
              {car.name} · {car.plateNumber}
            </p>
          </div>

          <Link
            href={`/dashboard/cars/${car.id}/maintenance/new`}
            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            + Добавить ТО
          </Link>
        </header>

        {car.maintenances.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
            <h2 className="text-xl font-medium">
              Записей ТО пока нет
            </h2>

            <p className="mx-auto mt-2 max-w-md text-neutral-500">
              Добавьте первую запись: когда делали обслуживание, что меняли,
              на каком пробеге и сколько это стоило.
            </p>

            <Link
              href={`/dashboard/cars/${car.id}/maintenance/new`}
              className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              + Добавить ТО
            </Link>
          </section>
        ) : (
          <section className="grid gap-4">
            {car.maintenances.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">
                      {formatDate(item.serviceDate)}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      ТО на пробеге {item.mileage.toLocaleString("ru-RU")} км
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium dark:border-neutral-800">
                      {formatMoney(item.cost)}
                    </div>

                    <DeleteMaintenanceButton
                      carId={car.id}
                      maintenanceId={item.id}
                    />
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                  {item.description}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}