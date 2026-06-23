"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function NewMaintenancePage() {
  const router = useRouter();
  const params = useParams<{ carId: string }>();

  const carId = params.carId;

  const [serviceDate, setServiceDate] = useState("");
  const [mileage, setMileage] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/cars/${carId}/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceDate,
          mileage,
          description,
          cost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось добавить запись ТО");
        return;
      }

      router.push(`/dashboard/cars/${carId}/maintenance`);
      router.refresh();
    } catch {
      setError("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href={`/dashboard/cars/${carId}/maintenance`}
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            ← Назад к ТО
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            CarNotes
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Добавить запись ТО
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Укажите дату, пробег, выполненные работы и стоимость.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-8"
        >
          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Дата ТО
              </span>

              <input
                type="date"
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Пробег
              </span>

              <input
                type="number"
                value={mileage}
                onChange={(event) => setMileage(event.target.value)}
                placeholder="Например, 120500"
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Что делалось / что менялось
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={"Например:\nЗамена масла\nЗамена масляного фильтра\nЗамена воздушного фильтра"}
                rows={7}
                className="w-full resize-none rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Стоимость
              </span>

              <input
                type="number"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
                placeholder="Например, 8500"
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="rounded-2xl bg-black px-5 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {loading ? "Сохраняем..." : "Сохранить запись ТО"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}