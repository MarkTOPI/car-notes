"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-black dark:bg-black dark:text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl dark:bg-red-950/30">
          ⚠️
        </div>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-red-500">
          Ошибка
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Что-то пошло не так
        </h1>

        <p className="mx-auto mt-3 max-w-md text-neutral-500">
          Попробуйте обновить страницу. Если ошибка повторится, проверьте
          терминал, там будет подробный текст ошибки.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Попробовать снова
          </button>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-neutral-200 px-5 py-3 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            На dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}