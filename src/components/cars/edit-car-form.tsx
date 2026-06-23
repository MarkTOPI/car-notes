"use client";

import { ImageUploadField } from "@/components/image-upload-field";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  car: {
    id: string;
    name: string;
    plateNumber: string;
    mileage: number;
    bodyType: string;
    color: string;
    fuelType: string;
    image: string | null;
  };
};

export function EditCarForm({ car }: Props) {
  const router = useRouter();

  const [name, setName] = useState(car.name);
  const [plateNumber, setPlateNumber] = useState(car.plateNumber);
  const [mileage, setMileage] = useState(String(car.mileage));
  const [bodyType, setBodyType] = useState(car.bodyType);
  const [color, setColor] = useState(car.color);
  const [fuelType, setFuelType] = useState(car.fuelType);
  const [image, setImage] = useState(car.image || "");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
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
        setError(data.error || "Не удалось обновить автомобиль");
        return;
      }

      router.push(`/dashboard/cars/${car.id}`);
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
            Название автомобиля
          </span>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
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

        <ImageUploadField
          label="Фото автомобиля"
          description="Выберите фото из галереи или сфотографируйте автомобиль."
          value={image}
          onChange={setImage}
          previewAlt="Фото автомобиля"
          cameraMode="environment"
        />

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