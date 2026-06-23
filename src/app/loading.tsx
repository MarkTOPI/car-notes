export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-black dark:bg-black dark:text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white dark:bg-white dark:text-black">
          🚗
        </div>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          CarNotes
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          Загружаем данные
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Подождите пару секунд.
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-black dark:bg-white" />
        </div>
      </div>
    </main>
  );
}