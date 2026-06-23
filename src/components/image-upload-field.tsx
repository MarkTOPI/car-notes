"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  previewAlt: string;
  cameraMode?: "user" | "environment";
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("Не удалось прочитать файл"));
    };

    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Не удалось загрузить изображение"));
    };

    image.src = src;
  });
}

async function resizeImageFile(file: File) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const maxSize = 1200;
  const quality = 0.82;

  const scale = Math.min(
    1,
    maxSize / Math.max(image.width, image.height)
  );

  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Не удалось обработать изображение");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  previewAlt,
  cameraMode = "environment",
}: Props) {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File | undefined) {
    setError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Можно загрузить только изображение");
      return;
    }

    const maxOriginalSize = 10 * 1024 * 1024;

    if (file.size > maxOriginalSize) {
      setError("Фото слишком большое. Максимум 10 МБ");
      return;
    }

    setLoading(true);

    try {
      const resizedImage = await resizeImageFile(file);
      onChange(resizedImage);
    } catch {
      setError("Не удалось обработать фото");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          {value ? (
            <img
              src={value}
              alt={previewAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl">📷</span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">
            {label}
          </p>

          {description && (
            <p className="mt-1 text-sm text-neutral-500">
              {description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={loading}
              className="rounded-2xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              {loading ? "Обработка..." : "Выбрать из галереи"}
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={loading}
              className="rounded-2xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              Сделать фото
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={loading}
                className="rounded-2xl border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Удалить фото
              </button>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture={cameraMode}
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}