"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  carId: string;
  expenseId: string;
};

export function DeleteExpenseButton({
  carId,
  expenseId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Удалить этот расход?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/cars/${carId}/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Не удалось удалить расход");
        return;
      }

      router.refresh();
    } catch {
      alert("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
    >
      {loading ? "Удаляем..." : "Удалить"}
    </button>
  );
}