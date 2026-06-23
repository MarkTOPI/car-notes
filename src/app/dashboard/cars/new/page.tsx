"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewCarPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [mileage, setMileage] = useState("");
  const [bodyType, setBodyType] = useState("SEDAN");
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState("GASOLINE");
  const [image, setImage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          plateNumber,
          mileage,
          bodyType,
          color,
          fuelType,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось добавить автомобиль");
        return;
      }

      router.push("/dashboard");
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
            href="/dashboard"
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            ← Назад
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            CarNotes
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Добавить автомобиль
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Заполните краткую информацию об автомобиле.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-8"
        >
          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Название автомобиля
              </span>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Например, BMW 520i"
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Гос. номер
              </span>

              <input
                value={plateNumber}
                onChange={(event) => setPlateNumber(event.target.value)}
                placeholder="Например, А123ВС777"
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
                Тип кузова
              </span>

              <select
                value={bodyType}
                onChange={(event) => setBodyType(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              >
                <option value="SEDAN">Седан</option>
                <option value="CROSSOVER">Кроссовер</option>
                <option value="SUV">Внедорожник</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Цвет
              </span>

              <input
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="Например, Черный"
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Тип топлива
              </span>

              <select
                value={fuelType}
                onChange={(event) => setFuelType(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
              >
                <option value="GASOLINE">Бензин</option>
                <option value="DIESEL">Дизель</option>
                <option value="HYBRID">Гибрид</option>
                <option value="ELECTRIC">Электро</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm text-neutral-500">
                Ссылка на фото автомобиля
              </span>

              <input
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="Можно оставить пустым"
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
              {loading ? "Сохраняем..." : "Сохранить автомобиль"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}