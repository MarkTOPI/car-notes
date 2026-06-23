"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  carId: string;
};

export function DeleteCarButton({ carId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Удалить автомобиль? Все записи ТО и расходы по нему тоже будут удалены."
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Не удалось удалить автомобиль");
        return;
      }

      router.push("/dashboard");
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
      className="rounded-2xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
    >
      {loading ? "Удаляем..." : "Удалить"}
    </button>
  );
}