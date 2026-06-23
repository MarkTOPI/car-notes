import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { EditCarForm } from "@/components/cars/edit-car-form";

type Props = {
  params: Promise<{
    carId: string;
  }>;
};

export default async function EditCarPage({ params }: Props) {
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
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
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
            Редактировать автомобиль
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Измените данные автомобиля и сохраните результат.
          </p>
        </header>

        <EditCarForm
          car={{
            id: car.id,
            name: car.name,
            plateNumber: car.plateNumber,
            mileage: car.mileage,
            bodyType: car.bodyType,
            color: car.color,
            fuelType: car.fuelType,
            image: car.image,
          }}
        />
      </div>
    </main>
  );
}