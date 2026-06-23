import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-black dark:bg-black dark:text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-4xl dark:bg-neutral-900">
          🛣️
        </div>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          404
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Страница не найдена
        </h1>

        <p className="mx-auto mt-3 max-w-md text-neutral-500">
          Возможно, запись была удалена, ссылка устарела или такого маршрута
          больше нет.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            На dashboard
          </Link>

          <Link
            href="/login"
            className="rounded-2xl border border-neutral-200 px-5 py-3 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            Войти заново
          </Link>
        </div>
      </div>
    </main>
  );
}