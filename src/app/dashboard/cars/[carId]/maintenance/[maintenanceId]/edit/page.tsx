import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { EditMaintenanceForm } from "@/components/maintenance/edit-maintenance-form";

type Props = {
  params: Promise<{
    carId: string;
    maintenanceId: string;
  }>;
};

function formatDateForInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function EditMaintenancePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { carId, maintenanceId } = await params;

  const car = await prisma.car.findFirst({
    where: {
      id: carId,
      userId: session.user.id,
    },
  });

  if (!car) {
    notFound();
  }

  const maintenance = await prisma.maintenance.findFirst({
    where: {
      id: maintenanceId,
      carId,
    },
  });

  if (!maintenance) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href={`/dashboard/cars/${car.id}/maintenance`}
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            ← Назад к ТО
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            CarNotes
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Редактировать запись ТО
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {car.name} · {car.plateNumber}
          </p>
        </header>

        <EditMaintenanceForm
          maintenance={{
            id: maintenance.id,
            carId: car.id,
            serviceDate: formatDateForInput(maintenance.serviceDate),
            mileage: maintenance.mileage,
            description: maintenance.description,
            cost: maintenance.cost,
          }}
        />
      </div>
    </main>
  );
}