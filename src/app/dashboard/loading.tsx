export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 h-9 w-64 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-3 h-5 w-48 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <div className="flex gap-3">
            <div className="h-12 w-28 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-12 w-36 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-4 h-8 w-32 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="h-44 animate-pulse bg-neutral-100 dark:bg-neutral-900" />

              <div className="p-5">
                <div className="h-6 w-40 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="h-16 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}