"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Не удалось войти в аккаунт");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
          <section className="hidden lg:block">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-neutral-500">
              CarNotes
            </p>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tight">
              Продолжайте вести историю своего автомобиля.
            </h1>

            <p className="mt-6 max-w-md text-neutral-500">
              Войдите в аккаунт, чтобы открыть список автомобилей, записи ТО и
              расходы.
            </p>
          </section>

          <section className="mx-auto w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
            <div className="mb-8">
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-neutral-500">
                CarNotes
              </p>

              <h2 className="text-3xl font-semibold">
                Вход
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Войдите в аккаунт, чтобы продолжить.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-neutral-500">
                  Email
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-neutral-500">
                  Пароль
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
                  placeholder="Ваш пароль"
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-black px-4 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
              Нет аккаунта?{" "}
              <Link
                href="/register"
                className="font-medium text-black underline underline-offset-4 dark:text-white"
              >
                Зарегистрироваться
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}