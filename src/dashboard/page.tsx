import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              CarNotes
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Мои автомобили
            </h1>
          </div>

          <div className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">
            {session.user?.name}
          </div>
        </header>

        <section className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
          <h2 className="text-xl font-medium">
            Пока автомобилей нет
          </h2>

          <p className="mx-auto mt-2 max-w-md text-neutral-500">
            Скоро здесь появится кнопка добавления автомобиля и список ваших
            машин.
          </p>

          <button className="mt-6 rounded-2xl bg-black px-5 py-3 text-white dark:bg-white dark:text-black">
            + Добавить автомобиль
          </button>
        </section>
      </div>
    </main>
  );
}