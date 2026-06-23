"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  maintenance: {
    id: string;
    carId: string;
    serviceDate: string;
    mileage: number;
    description: string;
    cost: number;
  };
};

export function EditMaintenanceForm({ maintenance }: Props) {
  const router = useRouter();

  const [serviceDate, setServiceDate] = useState(maintenance.serviceDate);
  const [mileage, setMileage] = useState(String(maintenance.mileage));
  const [description, setDescription] = useState(maintenance.description);
  const [cost, setCost] = useState(String(maintenance.cost));

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/cars/${maintenance.carId}/maintenance/${maintenance.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceDate,
            mileage,
            description,
            cost,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось обновить запись ТО");
        return;
      }

      router.push(`/dashboard/cars/${maintenance.carId}/maintenance`);
      router.refresh();
    } catch {
      setError("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  }

  return (
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
          {loading ? "Сохраняем..." : "Сохранить изменения"}
        </button>
      </div>
    </form>
  );
}