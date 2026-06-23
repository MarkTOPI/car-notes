"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось изменить пароль");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Пароль изменен");
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
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Смена пароля
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Укажите текущий пароль и новый пароль.
        </p>
      </div>

      <div className="grid gap-5">
        <label>
          <span className="mb-2 block text-sm text-neutral-500">
            Текущий пароль
          </span>

          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm text-neutral-500">
            Новый пароль
          </span>

          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm text-neutral-500">
            Повторите новый пароль
          </span>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
          />
        </label>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            {success}
          </div>
        )}

        <button
          disabled={loading}
          className="rounded-2xl bg-black px-5 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {loading ? "Сохраняем..." : "Изменить пароль"}
        </button>
      </div>
    </form>
  );
}