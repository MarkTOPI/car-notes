"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { DeleteExpenseButton } from "@/components/expenses/delete-expense-button";

type ExpenseItem = {
  id: string;
  carId: string;
  title: string;
  expenseDate: string;
  mileage: number;
  description: string | null;
  cost: number;
};

type Props = {
  carId: string;
  expenses: ExpenseItem[];
};

const expenseTypes = [
  "Все",
  "Заправка",
  "Ремонт",
  "Мойка",
  "Шиномонтаж",
  "Страховка",
  "Штраф",
  "Другое",
];

const sortOptions = [
  {
    value: "date-desc",
    label: "Сначала новые",
  },
  {
    value: "date-asc",
    label: "Сначала старые",
  },
  {
    value: "cost-desc",
    label: "Сначала дорогие",
  },
  {
    value: "cost-asc",
    label: "Сначала дешевые",
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU").format(new Date(date));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ExpensesList({ carId, expenses }: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Все");
  const [sort, setSort] = useState("date-desc");

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return expenses
      .filter((item) => {
        const matchesType = type === "Все" || item.title === type;

        const searchableText = [
          item.title,
          item.description || "",
          String(item.mileage),
          String(item.cost),
          formatDate(item.expenseDate),
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableText.includes(normalizedSearch);

        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "date-desc") {
          return (
            new Date(b.expenseDate).getTime() -
            new Date(a.expenseDate).getTime()
          );
        }

        if (sort === "date-asc") {
          return (
            new Date(a.expenseDate).getTime() -
            new Date(b.expenseDate).getTime()
          );
        }

        if (sort === "cost-desc") {
          return b.cost - a.cost;
        }

        if (sort === "cost-asc") {
          return a.cost - b.cost;
        }

        return 0;
      });
  }, [expenses, search, type, sort]);

  const filteredTotal = filteredExpenses.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <label>
            <span className="mb-2 block text-sm text-neutral-500">
              Поиск
            </span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Например: заправка, ремонт, 120000, 3500"
              className="w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:focus:border-white"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm text-neutral-500">
              Тип расхода
            </span>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:bg-black dark:focus:border-white"
            >
              {expenseTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm text-neutral-500">
              Сортировка
            </span>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-black dark:border-neutral-800 dark:bg-black dark:focus:border-white"
            >
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500">
              Найдено записей
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {filteredExpenses.length}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500">
              Сумма по фильтру
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {formatMoney(filteredTotal)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setType("Все");
              setSort("date-desc");
            }}
            className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
          <h2 className="text-xl font-medium">
            Ничего не найдено
          </h2>

          <p className="mx-auto mt-2 max-w-md text-neutral-500">
            Измените поиск, тип расхода или сортировку.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {filteredExpenses.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-500">
                    {formatDate(item.expenseDate)}
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Пробег: {item.mileage.toLocaleString("ru-RU")} км
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium dark:border-neutral-800">
                    {formatMoney(item.cost)}
                  </div>

                  <Link
                    href={`/dashboard/cars/${carId}/expenses/${item.id}/edit`}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  >
                    Редактировать
                  </Link>

                  <DeleteExpenseButton
                    carId={carId}
                    expenseId={item.id}
                  />
                </div>
              </div>

              {item.description && (
                <p className="mt-5 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </section>
  );
}