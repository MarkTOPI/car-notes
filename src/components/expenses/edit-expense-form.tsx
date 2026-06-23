"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const expenseTypes = [
  "Заправка",
  "Ремонт",
  "Мойка",
  "Шиномонтаж",
  "Страховка",
  "Штраф",
  "Другое",
];

type Props = {
  expense: {
    id: string;
    carId: string;
    title: string;
    expenseDate: string;
    mileage: number;
    description: string;
    cost: number;
  };
};

export function EditExpenseForm({ expense }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(expense.title);
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [mileage, setMileage] = useState(String(expense.mileage));
  const [description, setDescription] = useState(expense.description);
  const [cost, setCost] = useState(String(expense.cost));

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/cars/${expense.carId}/expenses/${expense.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            expenseDate,
            mileage,
            description,
            cost,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось обновить расход");
        return;
      }

      router.push(`/dashboard/cars/${expense.carId}/expenses`);
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
            Тип действия
          </span>

          <select
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
          >
            {expenseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm text-neutral-500">
            Дата
          </span>

          <input
            type="date"
            value={expenseDate}
            onChange={(event) => setExpenseDate(event.target.value)}
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
            Описание
          </span>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
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